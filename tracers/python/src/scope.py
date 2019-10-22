import sys
import types


def create_globals(allowed_builtins: set, override_builtins: dict, allowed_modules: set, full_halt_modules: bool = False):
    """
    Create a global scope to be used in exec calls, this scope may have restricted access to python builtins and
    modules.

    :allowed_builtins: set of strings with names of builtins to be part of the scope, empty set remove all builtins,
        None removes nothing.
    :allowed_modules: set of strings with names of modules to be part of the scope, empty set halts all modules, None
        halts nothing.
    :over_builtins: dict with functions to add or override over the default builtins.
    :full_halt_modules: removes modules references from the sys module.
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
            raise ModuleNotFoundError(f'access to {repr(module)} is halted')
        return import_(module, globals_, locals_, fromlist, level)

    if import_ is not None:
        builtins['__import__'] = halt_import

    return {'__name__': '__main__', '__builtins__': builtins}


class HookedInput:
    """
    Uses the received hook to do whatever action with the prompted text and get the input value.
    """

    def __init__(self, input_hook: types.FunctionType):
        self._input_hook = input_hook

    def __call__(self, prompt=''):
        prompt = str(prompt)
        return self._input_hook(prompt)


class HookedPrint:
    """
    Uses the received hook to do whatever action with the printed text.
    """

    def __init__(self, print_hook: types.FunctionType):
        self._print_hook = print_hook

    def __call__(self, *values, sep=None, end=None):
        if sep is not None and not isinstance(sep, str):
            raise TypeError(f'sep must be None or a string, not {type(end)}')
        if end is not None and not isinstance(end, str):
            raise TypeError(f'end must be None or a string, not {type(end)}')

        sep = sep if sep is not None else ' '
        end = end if end is not None else '\n'
        values = (str(value) for value in values)
        text = f'{sep.join(values)}{end}'
        self._print_hook(text)
