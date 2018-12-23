import copy
import sys
import types


def default_scope(file: str):
    """
    Return a default scope.

        :return: default scope
    """
    return Globals().property(Globals.FILE, file).build()


def sandbox_scope(file: str):
    """
    Return a sandboxed scope.

        :return: sandbox scope
    """
    builtins_to_remove = {'compile', 'exec', 'open'}
    modules_to_keep = {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'}
    modules_to_remove = {module for module in default_modules_names() if module not in modules_to_keep}

    globals_builder = Globals().property(Globals.FILE, file)
    [globals_builder.builtin(builtin, None) for builtin in builtins_to_remove]

    modules_halter = Modules()
    [modules_halter.halt(module) for module in modules_to_remove]

    return modules_halter.apply(globals_builder.build())


def default_builtins_names():
    """
    List default builtins
    """
    return [*Globals().build()[Globals.BUILTINS].keys()]


def default_modules_names():
    """
    List default modules
    """
    return[*sys.modules.keys()]


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


class Modules:
    """
    Halt modules from a specified scope.
    """

    # some default names
    IMPORT = '__import__'

    def __init__(self):
        """
        Initialize witout any halted module.
        """
        self._halted = []

    def halt(self, module: str):
        """
        Add module to halted list.

            :param module: module to halt

            :return: self
        """
        self._halted.append(module)
        return self

    def apply(self, scope: dict, full: bool = False):
        """
        Halt modules from the scope.

            :param scope: scope to halt modules
            :param full: halt from sys module (entire application)

            :raise: KeyError - if scope does not contain __builtins__
            :raise: TypeError - if __builtins__ is not a dict
            :raise: AttributeError - if __builtins__ does not contain __import__
            :return: scope copy with halted modules
        """
        if not isinstance(scope[Globals.BUILTINS], dict):
            raise TypeError('__builtins__ is not a dict')
        if Modules.IMPORT not in scope[Globals.BUILTINS]:
            raise AttributeError('__builtins__ does not contain __import__')

        scope = copy.deepcopy(scope)
        scope_builtins = scope[Globals.BUILTINS]
        default_import = scope_builtins[Modules.IMPORT]
        halt_import = Modules._halt_import(default_import, self._halted)
        scope_builtins[Modules.IMPORT] = halt_import

        if full:
            sys.modules = {name: mod for name, mod in sys.modules.items() if name in self._halted}

        return scope

    @staticmethod
    def _halt_import(default_import: types.BuiltinFunctionType, halted: list):
        """
        Creates a function that blocks imports.

            :param default_import: default import function
            :param halted: modules to block

            :return: import function that blocks halted modules
        """
        def halt_import(module, global_scope, local_scope, attributes, level):
            if module in halted:
                raise ModuleNotFoundError(f'No module named {repr(module)}')
            default_import(module, global_scope, local_scope, attributes, level)

        return halt_import
