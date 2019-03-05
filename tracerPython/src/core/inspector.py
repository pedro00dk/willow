import types
from .util import ExceptionUtil, FrameUtil


class Inspector:
    """
    Inspects the received frame, building the stack and heap data and references.
    """

    def inspect(self, frame: types.FrameType, event: str, args, exec_call_frame: types.FrameType):
        stack, frames = self.inspect_stack(frame, exec_call_frame, True)
        heap, stack_references = self.inspect_heap(frames)
        return {
            'name': event,
            'finish': event == 'return' and len(frames) == 1,
            'exception': ExceptionUtil.dump(args[1], args[2]) if event == 'exception' else None,
            'stack': stack,
            'stackReferences': stack_references,
            'heap': heap
        }

    def inspect_stack(self, frame: types.FrameType, exec_call_frame: types.FrameType, only_frame_file: bool):
        current_frame = frame
        frames = []
        while current_frame != exec_call_frame:
            frames.append(current_frame)
            current_frame = FrameUtil.previous(current_frame)

        frame_file = FrameUtil.file(frame)
        frames = [frame for frame in frames if not only_frame_file or FrameUtil.is_file(frame, frame_file)]
        stack = [{'name': FrameUtil.name(frame), 'line': FrameUtil.line(frame)} for frame in frames]
        return stack, frames

    def inspect_heap(self, stack_frames: list):
        module = FrameUtil.module(stack_frames[-1])
        heap = {}
        classes = set()
        stack_references = []
        for frame in stack_frames[::-1]:
            scope_variables = FrameUtil.locals(frame)
            scope_references = [
                (name, self.inspect_obj(scope_variables[name], heap, classes, module))
                for name, value in scope_variables.items() if not name.startswith('_')
            ]
            stack_references.append(scope_references)

        return heap, stack_references

    def inspect_obj(self, obj, heap: dict, classes: set, module: str):
        """
        Inspects obj.
        If obj is a const (bool, int, float, None, complex, str), returns its value.
        If obj is a type (type), returns its type name.
        Otherwise, returns a obj reference (list with a single number inside) inspecting obj members and filling the
        heap and classes.
        """
        reference = id(obj)
        if reference in heap:
            return reference,

        if isinstance(obj, (bool, int, float, type(None))):
            return obj
        if isinstance(obj, (complex, str)):
            return repr(obj)
        if isinstance(obj, type):
            if obj.__module__ == module:
                classes.add(obj)
            return obj.__name__

        generic_type = ''
        members = None

        if isinstance(obj, (tuple, list, set)):
            generic_type = 'tuple' if isinstance(obj, tuple) else 'list' if isinstance(obj, list) else 'set'
            members = [*enumerate(obj)]
        elif isinstance(obj, dict):
            generic_type = 'map'
            members = [*obj.items()]
        elif isinstance(obj, (*classes,)):
            generic_type = 'other'
            members = [(name, value) for name, value in vars(obj).items() if not name.startswith('_')]
        else:  # unknown type
            generic_type = 'other'

        if members:  # known object type processing
            # add reference to heap graph (has to be added before other objects inspections)
            heap[reference] = {}
            members_inspections = [
                (self.inspect_obj(name, heap, classes, module), self.inspect_obj(value, heap, classes, module))
                for name, value in members
            ]
            heap[reference] = {
                'type': generic_type,
                'lType': type(obj).__name__,
                'userDefined': generic_type == 'other',
                'members': members_inspections
            }
            return reference,
        else:  # unknown object type processing
            # instead of inspecting unknown objects, i decided to inspect its type
            return self.inspect_obj(type(obj), heap, classes, module)
