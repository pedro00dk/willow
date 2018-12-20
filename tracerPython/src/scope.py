import copy


class Globals:
    """
    Generate global scopes with the specificed names and restrictions.
    """

    # some default names
    BUILTINS = '__builtins__'
    FILE = '__file__'
    NAME = '__name__'

    def __init__(self):
        """
        Initialize the default global scope.
        """
        host_builtins = globals()[Globals.BUILTINS]
        builtins = host_builtins.copy() if isinstance(host_builtins, dict) else vars(host_builtins).copy()
        self._globals = {Globals.BUILTINS: builtins, Globals.FILE: None, Globals.NAME: '__main__'}

    def property(self, name: str, value):
        """
        Set a scope property, creating a new one if it does not exist.

            :param name: property name to set
            :param value: value to set in name property

            :return: self
        """
        self._globals[name] = value
        return self

    def builtin(self, name: str, value):
        """
        Set a builtin property, creating anew one if it does not exist.
        Builtins should not be None, if None is set, the builtin is removed.

            :param name: builtin name to set
            :param value: value to set in name builtin

            :raise: AttributeError - if __builtins__ property was modified
            :return: self
        """
        if not isinstance(self._globals[Globals.BUILTINS], dict):
            raise AttributeError('global __builtins__ attribute was modified')

        builtins = self._globals[Globals.BUILTINS]
        if value:
            builtins[name] = value
        else:
            builtins.pop(name)
        return self

    def build(self) -> dict:
        """
        Return the built globals.

            :return: created globals
        """
        return copy.deepcopy(self._globals)
