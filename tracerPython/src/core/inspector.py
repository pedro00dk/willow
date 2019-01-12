import types

from .util import ExceptionUtil, FrameUtil


class Inspector:
    """
    Inspects the received frame, building the stack and heap data and references.
    """

    @classmethod
    def inspect(cls, frame: types.FrameType, event: str, args, exec_call_frame: types.FrameType):
        """
        Inspects the application state. Analyses the stack and heap, collecting the objects.
        """
        stack_frames, stack_lines = cls.inspect_stack(frame, exec_call_frame, True)
        stack_references, heap_graph, user_classes = cls.inspect_heap(stack_frames)

        # args -> exception type, exception object, exception traceback (different from exception object __traceback__)
        args = args if event != 'exception' else ExceptionUtil.dump(args[1], args[2])

        finish = event == 'return' and len(stack_frames) == 1
        return {
            'name': event,
            'args': args,
            'line': stack_lines[0]['line'],
            'stackLines': stack_lines,
            'stackReferences': stack_references,
            'heapGraph': heap_graph,
            'userClasses': user_classes,
            'finish': finish
        }

    @classmethod
    def inspect_stack(cls, frame: types.FrameType, exec_call_frame: types.FrameType, only_frame_file: bool):
        """
        Inspects the application stack.
        """
        current_frame = frame
        frames = []
        while current_frame != exec_call_frame:
            frames.append(current_frame)
            current_frame = FrameUtil.previous(current_frame)

        frame_file = FrameUtil.file(frame)
        frames = [frame for frame in frames if not only_frame_file or FrameUtil.is_file(frame, frame_file)]

        lines = [{'name': FrameUtil.name(frame), 'line': FrameUtil.line(frame)} for frame in frames]
        return frames, lines

    @classmethod
    def inspect_heap(cls, stack_frames: list):
        """
        Inspects the application heap by looking every object recursively found from the stack frames.
        """
        module_name = FrameUtil.module(stack_frames[-1])

        stack_references = []
        heap_graph = {}
        user_classes = set()

        for frame in stack_frames[::-1]:
            frame_variables = FrameUtil.locals(frame)
            frame_references = [
                (name, cls.inspect_object(frame_variables[name], heap_graph, user_classes, module_name))
                for name, value in frame_variables.items() if not name.startswith('_')
            ]
            stack_references.append(frame_references)

        return stack_references, heap_graph, [user_class.__name__ for user_class in user_classes]

    @classmethod
    def inspect_object(cls, obj, heap_graph: dict, user_classes: set, module_name: str):
        """
        Inspects the received object.
        If the object is a const (bool, int, float, None, complex, str), returns its value.
        If the object is a type (type), returns its type name.
        Otherwise, returns the object reference (list with a single number inside) recursively, inspecting object
        members and filling the heap_graph and user_classes
        """
        # already inspected
        reference = id(obj)
        if reference in heap_graph:
            return reference,

        # const type
        if isinstance(obj, (bool, int, float, type(None))):
            return obj
        if isinstance(obj, (complex, str)):
            return repr(obj)
        if isinstance(obj, type):
            if obj.__module__ == module_name:
                user_classes.add(obj)
            return obj.__name__

        # known type
        if isinstance(obj, (list, tuple, set)):
            members = enumerate(obj)
        elif isinstance(obj, dict):
            members = obj.items()
        elif isinstance(obj, (*user_classes,)):
            members = ((name, value) for name, value in vars(obj).items() if not name.startswith('_'))

        # unknown type
        else:
            members = None

        # known object type processing
        if members:

            # add reference to heap graph (has to be added before other objects inspections)
            heap_graph[reference] = {}
            members_inspections = [
                (
                    cls.inspect_object(name, heap_graph, user_classes, module_name),
                    cls.inspect_object(value, heap_graph, user_classes, module_name)
                )
                for name, value in members
            ]

            # update with all data
            heap_graph[reference] = {'type': type(obj).__name__, 'members': members_inspections}
            return reference,

        # unknown object type processing
        else:
            return cls.inspect_object(type(obj), heap_graph, user_classes, module_name)
