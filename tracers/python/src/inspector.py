import sys
import types


class Inspector:
    """
    Inspect frames and produces snapshots with the state.
    """

    def __init__(self):
        """
        Initialize the inspector and the ordered id generators.
        """
        self.ordered_id_count = 0
        self.ordered_ids = {}
        self.previous_ordered_ids = {}

    # types that can be converted to a JSON string
    STRING_LIKE_TYPES = (bool, complex, str, type(None))

    # types that can be converted to a JSON number (within javascript's restriction of +-2^53 - 1)
    NUMBER_LIKE_TYPES = (int, float)

    def inspect(self, frame: types.FrameType, event: str, args, exec_frame: types.FrameType):
        """
        Inspect the frame and its event to build a snapshot with state.
        - frame: `FrameType`: frame where the state data will be extracted from
        - event: `str`: frame event type, one of: call, line, exception or return
        - args: `any | any[t]`: return object if event is return or exception data if event is exception
        - exec_frame: `FrameType`: frame of the exec() call, it is used to know which frame is the base frame
        - return `dict`: the snapshot
        """
        self.previous_ordered_ids = self.ordered_ids
        self.ordered_ids = {}

        frames = self._collect_frames(frame, exec_frame)
        stack = self._create_stack(frames)
        heap = self._create_heap(stack, frames, event, args)
        return {'event': event, 'stack': stack, 'heap': heap}

    def _collect_frames(self, frame: types.FrameType, stop_frame: types.FrameType):
        """
        Collect all frames of the same file until a stop frame is found.
        - frame: `FrameType`: frame to start collecting parents
        - stop_frame: `FrameType`: stops the collecting frame if stop_frame is found
        - return `FrameType[]`: collected frames
        """
        filename = frame.f_code.co_filename
        frames = []
        while frame is not None and frame != stop_frame and frame.f_code.co_filename == filename:
            frames.append(frame)
            frame = frame.f_back
        frames.reverse()
        return frames

    def _create_stack(self, frames: list):
        """
        Creates a list of dicts with the names and first lines of the the received frames
        - frames `FrameType[]` collected frames
        - return `dict`: collected stack data
        """
        return [{'line': frame.f_lineno - 1, 'name': frame.f_code.co_name} for frame in frames]

    def _create_heap(self, stack: list, frames: list, event: str, args):
        """
        Create and populate the heap, and also set the members of stack scopes.
        - stack `dict`: collected stack data from frames
        - frames `FrameType[]` collected frames
        - event: `str`: frame event type, one of: call, line, exception or return
        - args: `any | any[t]`: return object if event is return or exception data if event is exception
        - return `dict`: heap containing objects
        """
        heap = {}
        module = frames[-1].f_globals['__name__']
        classes = set()
        for scope, frame in zip(stack, frames):
            variables = frame.f_locals
            scope['members'] = [
                {'key': key, 'value': self._inspect_object(heap, variables[key], classes, module)}
                for key, value in variables.items() if not key.startswith('_')
            ]
        if event == 'return' and len(stack) > 1:
            stack[-1]['members'].append({'key': '#return#', 'value': self._inspect_object(heap, args, classes, module)})
        return heap

    def _inspect_object(self, heap: dict, obj, classes: set, module: str):
        """
        Recursively inspect objects in the heap.
        String and Number like objects are transformed in str or int.
        Complex objects are transformed in dictionaries that contain information of their type and members and added to
        the snapshot, then their references are returned as a list.
        - heap: `dict`: heap dict to be filled with obj information
        - obj: `*any`: object to be processed
        - classes: `set<str>`: set of user defined classes, which is used to known which objects shall be analyzed
        - module: main module name, used to only save classes that where declared in it
        - return `int | float | str | [str]`: the transformed value
        """
        if isinstance(obj, Inspector.STRING_LIKE_TYPES):
            return str(obj)
        elif isinstance(obj, Inspector.NUMBER_LIKE_TYPES):
            return obj if abs(obj) < 2 ** 53 else str(obj)
        elif isinstance(obj, type):
            if obj.__module__ == module:
                classes.add(obj)
            return str(obj)

        id_ = str(id(obj))
        if id_ in self.ordered_ids:
            ordered_id = self.ordered_ids[id_]
        elif id_ in self.previous_ordered_ids:
            ordered_id = self.ordered_ids[id_] = self.previous_ordered_ids[id_]
        else:
            ordered_id = self.ordered_ids[id_] = self.ordered_id_count
            self.ordered_id_count += 1

        if ordered_id in heap:
            return [ordered_id]

        type_ = type(obj).__name__
        category = 'other'
        members = None

        if isinstance(obj, (tuple, list, set)):
            category = 'list' if not isinstance(obj, set) else 'set'
            members = [*enumerate(obj)]
        elif isinstance(obj, dict):
            category = 'map'
            members = [*obj.items()]
        elif isinstance(obj, (*classes,)):
            category = 'map'
            members = [(key, value) for key, value in vars(obj).items() if not key.startswith('_')]

        if members is not None:  # known object type
            # add object id to the heap before further inspections to avoid stack overflows
            obj = heap[ordered_id] = {}
            obj['id'] = ordered_id
            obj['category'] = category
            obj['type'] = type_
            obj['members'] = [
                {
                    'key': self._inspect_object(heap, key, classes, module),
                    'value': self._inspect_object(heap, value, classes, module)
                }
                for key, value in members
            ]
            return [ordered_id]
        else:  # unknown object type
            # instead of inspecting unknown objects, inspect their type only
            return self._inspect_object(heap, type(obj), classes, module)
