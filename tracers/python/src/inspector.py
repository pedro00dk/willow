import sys
import types


class Inspector:
    """
    Inspect frames and produces dictionaries with their state data.
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

    # types that can be converted to a JSON number (with javascript's restriction of 2^53 - 1)
    NUMBER_LIKE_TYPES = (int, float)

    def inspect(self, frame: types.FrameType, event: str, exec_frame: types.FrameType):
        """
        Inspect the frame and its event to build a dictionary with state data.

        > frame: `frame`: frame where the state data will be extracted from
        > exec_frame: `frame`: frame of the exec() call, it is used to know which frame is the base frame

        > return `dict`: the processed frame data
        """
        self.previous_ordered_ids = self.ordered_ids
        self.ordered_ids = {}

        snapshot = {'info': 'ok' if event != 'exception' else 'warn'}

        current_frame = frame
        frames = []
        while current_frame != exec_frame and current_frame is not None:
            frames.append(current_frame)
            current_frame = current_frame.f_back

        filename = frame.f_code.co_filename
        frames = [frame for frame in frames if frame.f_code.co_filename == filename]
        frames.reverse()
        snapshot['stack'] = [{'line': frame.f_lineno - 1, 'name': frame.f_code.co_name} for frame in frames]

        snapshot['heap'] = {}
        module = frames[-1].f_globals['__name__']
        classes = set()
        for i, frame in enumerate(frames):
            variables = frame.f_locals
            snapshot['stack'][i]['members'] = [
                {'key': key, 'value': self._inspect_object(snapshot, variables[key], classes, module)}
                for key, value in variables.items() if not key.startswith('_')
            ]

        return snapshot

    def _inspect_object(self, snapshot: dict, obj, classes: set, module: str):
        """
        Recursively inspect objects of the heap.
        String and Number like objects are transformed in str or int.
        Complex objects are transformed in dictionaries that contain information of their type and members and added to
        the snapshot, then their references are returned as a list.

        > snapshot: `dict`: snapshot to be filled with heap information
        > obj: `*any`: object to be processed
        > classes: `set<str>`: set of user defined classes, which is used to known which objects shall be analyzed
        > module: main module name, used to only save classes that where declared in it

        > return `int | float | str | [str]`: the transformed value
        """

        if isinstance(obj, Inspector.STRING_LIKE_TYPES):
            return str(obj)
        if isinstance(obj, Inspector.NUMBER_LIKE_TYPES):
            return obj if abs(obj) < 2 ** 53 else str(obj)
        if isinstance(obj, type):
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
        
        if ordered_id in snapshot['heap']:
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
            obj = snapshot['heap'][ordered_id] = {}
            obj['category'] = category
            obj['type'] = type_
            obj['members'] = [
                {
                    'key': self._inspect_object(snapshot, key, classes, module),
                    'value': self._inspect_object(snapshot, value, classes, module)
                }
                for key, value in members
            ]
            return [ordered_id]
        else:  # unknown object type
            # instead of inspecting unknown objects, inspect their type only
            return self._inspect_object(snapshot, type(obj), classes, module)
