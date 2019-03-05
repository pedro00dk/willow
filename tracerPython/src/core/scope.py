import copy
import sys
import types


def default_scope(file: str):
    """
    Returns a default scope.
    """
    globals_builder, modules_halter = default_scope_composers(file)
    return modules_halter.apply(globals_builder.build())


def default_scope_composers(file: str):
    """
    Returns default scope composers.
    """
    globals_builder = Globals().property(Globals.FILE, file)
    modules_halter = Modules()
    return globals_builder, modules_halter


def sandbox_scope(file: str):
    """
    Returns a sandboxed scope.
    """
    globals_builder, modules_halter = sandbox_scope_composers(file)
    return modules_halter.apply(globals_builder.build())


def sandbox_scope_composers(file: str):
    """
    Returns a sandboxed scope composers.
    """
    builtins_to_remove = {'open'}
    modules_to_keep = {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'}
    modules_to_remove = {module for module in default_modules_names() if module not in modules_to_keep}

    globals_builder = Globals().property(Globals.FILE, file)
    [globals_builder.builtin(builtin, None) for builtin in builtins_to_remove]

    modules_halter = Modules()
    [modules_halter.halt(module) for module in modules_to_remove]
    return globals_builder, modules_halter


def default_builtins_names():
    """
    Lists default builtins.
    """
    return [*Globals().build()[Globals.BUILTINS].keys()]


def default_modules_names():
    """
    Lists default modules.
    """
    return[*sys.modules.keys()]


class Globals:
    """
    Generates global scopes with the specificed names and restrictions.
    """

    # some default names
    BUILTINS = '__builtins__'
    FILE = '__file__'
    NAME = '__name__'

    def __init__(self):
        host_builtins = globals()[Globals.BUILTINS]
        builtins = host_builtins.copy() if isinstance(host_builtins, dict) else vars(host_builtins).copy()
        self._globals = {Globals.BUILTINS: builtins, Globals.FILE: None, Globals.NAME: '__main__'}

    def property(self, name: str, value):
        self._globals[name] = value
        return self

    def builtin(self, name: str, value):
        if not isinstance(self._globals[Globals.BUILTINS], dict):
            raise AttributeError('global __builtins__ attribute was modified')

        builtins = self._globals[Globals.BUILTINS]
        if value:
            builtins[name] = value
        else:
            builtins.pop(name)
        return self

    def build(self) -> dict:
        return copy.copy(self._globals)


class Modules:
    """
    Halts modules from a specified scope.
    """

    # some default names
    IMPORT = '__import__'

    def __init__(self):
        self._halted = []

    def halt(self, module: str):
        self._halted.append(module)
        return self

    def apply(self, scope: dict, full: bool = False):
        if not isinstance(scope[Globals.BUILTINS], dict):
            raise TypeError('__builtins__ is not a dict')
        if Modules.IMPORT not in scope[Globals.BUILTINS]:
            raise AttributeError('__builtins__ does not contain __import__')

        scope = copy.copy(scope)
        scope_builtins = scope[Globals.BUILTINS]
        default_import = scope_builtins[Modules.IMPORT]
        halt_import = Modules._halt_import(default_import, self._halted)
        scope_builtins[Modules.IMPORT] = halt_import

        if full:
            sys.modules = {name: mod for name, mod in sys.modules.items() if name in self._halted}

        return scope

    @staticmethod
    def _halt_import(default_import: types.BuiltinFunctionType, halted: list):
        def halt_import(module, global_scope, local_scope, attributes, level):
            if module in halted:
                raise ModuleNotFoundError(f'No module named {repr(module)}')
            default_import(module, global_scope, local_scope, attributes, level)

        return halt_import
