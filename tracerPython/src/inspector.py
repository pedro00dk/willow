import sys
import types
from protobuf import snapshot_pb2
import traceback


def exceptionMessage(exception: Exception, with_traceback: types.TracebackType = None, remove_lines: tuple = ()):
    """
    Builds exception messages from objects.
    """
    formatted_traceback = traceback.format_exception(
        type(exception),
        exception,
        exception.__traceback__ if not with_traceback else with_traceback
    )
    return snapshot_pb2.Exception(
        type=type(exception).__name__,
        args=[str(arg) for arg in exception.args],
        traceback=[line for i, line in enumerate(formatted_traceback) if i not in remove_lines]
    )


class Inspector:
    """
    Inspects the received frame, building a snapshot from it.
    """

    def inspect(self, frame: types.FrameType, event: str, args, exec_call_frame: types.FrameType):
        snapshot = snapshot_pb2.Snapshot()
        current_frame = frame
        frames = []
        while current_frame != exec_call_frame:
            frames.append(current_frame)
            current_frame = current_frame.f_back

        file = frame.f_code.co_filename
        frames = [frame for frame in frames if frame.f_code.co_filename == file]
        frames.reverse()
        [snapshot.stack.add(line=frame.f_lineno - 1, name=frame.f_code.co_name) for frame in frames]

        snapshot.heap.clear()
        module = frames[-1].f_globals['__name__']
        classes = set()
        for i, frame in enumerate(frames):
            variables = frame.f_locals
            snapshot.stack[i].variables.extend([
                snapshot_pb2.Variable(name=name, value=self._inspect_object(snapshot, variables[name], classes, module))
                for name, value in variables.items() if not name.startswith('_')
            ])

        snapshot.type = snapshot_pb2.Snapshot.Type.Value(event.upper())
        snapshot.finish = event == 'return' and len(snapshot.stack) == 1
        if event == 'exception':
            snapshot.exception.CopyFrom(exceptionMessage(args[1], args[2]))

        return snapshot

    def _inspect_object(self, snapshot: snapshot_pb2.Snapshot, obj, classes: set, module: str):
        if isinstance(obj, bool):
            return snapshot_pb2.Value(boolean=obj)
        if isinstance(obj, int):
            if abs(obj) <= sys.maxsize:
                return snapshot_pb2.Value(integer=obj)
            else:
                return snapshot_pb2.Value(other=str(obj))
        if isinstance(obj, float):
            return snapshot_pb2.Value(float=obj)
        if isinstance(obj, complex):
            return snapshot_pb2.Value(other=repr(obj))
        elif isinstance(obj, str):
            return snapshot_pb2.Value(string=obj)
        if isinstance(obj, type(None)):
            return snapshot_pb2.Value(other=str(obj))
        elif isinstance(obj, type):
            if obj.__module__ == module:
                classes.add(obj)
            return snapshot_pb2.Value(other=obj.__name__)

        reference = str(id(obj))
        if reference in snapshot.heap:
            return snapshot_pb2.Value(reference=reference)

        generic_type = snapshot_pb2.Object.Type.Value('OTHER')
        language_type = type(obj).__name__
        user_defined = False
        members = None

        if isinstance(obj, (tuple, list, set)):
            generic_type = snapshot_pb2.Object.Type.Value('TUPLE') if isinstance(obj, tuple) else \
                snapshot_pb2.Object.Type.Value('ALIST') if isinstance(obj, list) else \
                snapshot_pb2.Object.Type.Value('SET')
            members = [*enumerate(obj)]
        elif isinstance(obj, dict):
            generic_type = snapshot_pb2.Object.Type.Value('HMAP')
            members = [*obj.items()]
        elif isinstance(obj, (*classes,)):
            user_defined = True
            members = [(key, value) for key, value in vars(obj).items() if not key.startswith('_')]
        else:
            # unknown object type
            pass

        if members is not None:
            # known object type
            # add reference to heap graph (it has to be added before other objects inspections)
            heapObject = snapshot.heap[reference]
            heapObject.type = generic_type
            heapObject.languageType = language_type
            heapObject.userDefined = user_defined
            heapObject.members.extend([
                snapshot_pb2.Member(key=self._inspect_object(snapshot, key, classes, module),
                                    value=self._inspect_object(snapshot, value, classes, module))
                for key, value in members
            ])
            return snapshot_pb2.Value(reference=reference)
        else:
            # unknown object type
            # instead of inspecting unknown objects, I decided to inspect its type
            return self._inspect_object(type(obj), heap, classes, module)
