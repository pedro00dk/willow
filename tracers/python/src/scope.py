import sys
import types


def create_globals(allowed_builtins: set, override_builtins: dict, allowed_modules: set, full_halt_modules: bool = False):
    """
    Produce globals scope objects with controlled restrictions that can be used by exec().

    > allowed_builtins: `set<str>`: builtins to allow in the scope, empty set removes all, `None` removes nothing
    > override_builtins: `dict<str, any>`: extra builtins to override or add to the allowed ones
    > allowed_modules: `set<str>`: modules to allow in the scope, empty set halts all, `None` halts nothing
    > full_halt_modules: `bool`: remove modules references from the sys module

    > return `dict`: globals() like object with the received restrictions
    """

    builtins = globals()['__builtins__']
    builtins = builtins.copy() if isinstance(builtins, dict) else vars(builtins).copy()

    if allowed_builtins is not None:
        builtins = {name: obj for name, obj in builtins.items() if name in allowed_builtins}

    if override_builtins is not None:
        builtins = {**builtins, **override_builtins}

    if full_halt_modules and allowed_modules is not None:
        sys.modules = {name: mod for name, mod in sys.modules.items() if name in allowed_modules}

    import_ = builtins['__import__']

    def halt_import(module, globals_, locals_, fromlist, level):
        if module not in allowed_modules:
            raise ModuleNotFoundError(f'access to {repr(module)} is halted. Allowed: {str(allowed_modules)}')
        return import_(module, globals_, locals_, fromlist, level)

    if import_ is not None:
        builtins['__import__'] = halt_import

    return {'__name__': '__main__', '__builtins__': builtins}
