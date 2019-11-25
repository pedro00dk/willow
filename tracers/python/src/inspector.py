import sys
import types


class Inspector:
    """
    Inspector processes a frame object and produces a dictionary with stack and heap of the current frame.
    """

    # types that can be converted to a JSON string
    STRING_LIKE_TYPES = (bool, complex, str, type(None))

    # types that can be converted to a JSON number (with javascript's restriction of `2**53 - 1`)
    NUMBER_LIKE_TYPES = (int, float)

    def inspect(self, frame: types.FrameType, event: str, exec_call_frame: types.FrameType):
        """
        Inspect the received frame and its event to build a dictionary with inspection data.

        > frame: `frame`: frame where the stack and heap data will be extracted from.  
        > event: `str`: type of event the frame is refering to, one of `['call', 'line', 'exception', 'return']`.  
        > exec_call_frame: `frame`: the frame of the exec call, it is used to know which frame is the base frame.
        
        > return `dict`: a dictionary with the processed frame data.
        """

        snapshot = {'type': event}

        current_frame = frame
        frames = []
        while current_frame != exec_call_frame:
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
            snapshot['stack'][i]['variables'] = [
                {'name': name, 'value': self._inspect_object(snapshot, variables[name], classes, module)}
                for name, value in variables.items() if not name.startswith('_')
            ]

        return snapshot

    def _inspect_object(self, snapshot: dict, obj, classes: set, module: str):
        """
        Recursively inspect objects of the heap. String like and Number like objects are transformed in their JSON
        equivalents, while complex objects are transformed in JSON objects that contain information of its type and
        members and then added to the snapshot, only their references are returned.

        > snapshot: `dict`: snapshot to be filled with heap information.  
        > obj: `*any`: current object to be processed.  
        > classes: `set<str>`: set of user defined classes, it is used to known which objects shall be analyzed.  
        > module: the name of the main module to only save classes that where declared in it.  

        > return `int | float | str | [str]`: the final JSON value.
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
        if id_ in snapshot['heap']:
            return [id_]

        generic_type = 'other'
        language_type = type(obj).__name__
        user_defined = False
        members = None

        if isinstance(obj, (tuple, list, set)):
            generic_type = 'tuple' if isinstance(obj, tuple) else 'alist' if isinstance(obj, list) else 'set'
            members = [*enumerate(obj)]
        elif isinstance(obj, dict):
            generic_type = 'map'
            members = [*obj.items()]
        elif isinstance(obj, (*classes,)):
            user_defined = True
            members = [(key, value) for key, value in vars(obj).items() if not key.startswith('_')]

        if members is not None:  # known object type
            # add object id to the snapshot heap (it has to be added before other object inspections)
            obj = snapshot['heap'][id_] = {}
            obj['type'] = generic_type
            obj['languageType'] = language_type
            obj['userDefined'] = user_defined
            obj['members'] = [
                {
                    'key': self._inspect_object(snapshot, key, classes, module),
                    'value': self._inspect_object(snapshot, value, classes, module)
                }
                for key, value in members
            ]
            return [id_]
        else:  # unknown object type
            # instead of inspecting unknown objects, I decided to inspect its type
            return self._inspect_object(snapshot, type(obj), classes, module)
