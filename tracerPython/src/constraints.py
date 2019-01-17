class Constraints:
    """
    Stores code constraints.
    """

    def __init__(self, max_frames: int, max_stacks: int, max_objects: int, max_properties: int, max_iterables: int, max_strings: int, sandbox: bool):
        """
        Crates the constraints object with its values.
        """
        self._max_frames = max_frames
        self._max_stacks = max_stacks
        self._max_objects = max_objects
        self._max_properties = max_properties
        self._max_iterables = max_iterables
        self._max_strings = max_strings
        self._sandbox = sandbox

    def check_max_frames(self, frames: int):
        if (self._max_frames and self._max_frames <= frames):
            raise Exception(f'constraint: maximum frame count reached ({self._max_frames}), shorten your code')

    def check_max_stacks(self, stacks: int):
        if (self._max_stacks and self._max_stacks <= stacks):
            raise Exception(f'constraint: maximum stack size reached ({self._max_stacks}), stack overflow')

    def check_max_objects(self, objects: int):
        if (self._max_objects and self._max_objects <= objects):
            raise Exception(f'constraint: maximum object count reached ({self._max_objects}), reduce the object count')

    def check_max_properties(self, properties: int):
        if (self._max_properties and self._max_properties <= properties):
            raise Exception(
                f'constraint: maximum object property count reached ({self._max_properties}), some object has too many properties'
            )

    def check_max_iterables(self, iterables: int):
        if (self._max_iterables and self._max_iterables <= iterables):
            raise Exception(
                f'constraint: maximum iterable length reached ({self._max_iterables}), some tuple, list, set or dict is too big'
            )

    def check_max_strings(self, strings: int):
        if (self._max_strings and self._max_strings <= strings):
            raise Exception(f'constraint: maximum string length reached ({self._max_strings}), some string is too big')

    def is_sandbox(self):
        return self._sandbox
