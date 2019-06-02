import sys


def create_globals(main: str, builtins: set, modules: set, full_halt: bool = False):
    bts = '__builtins__'
    file = '__file__'
    name = '__name__'
    imp = '__import__'
    generated_globals = {
        bts: globals()[bts].copy() if isinstance(globals()[bts], dict) else vars(globals()[bts]).copy(),
        file: main,
        name: '__main__'
    }
    if builtins is not None:
        generated_globals[bts] = {name: obj for name, obj in generated_globals[bts].items() if name in builtins}

    if modules is None or imp not in generated_globals[bts]:
        return generated_globals

    if full_halt:
        sys.modules = {name: mod for name, mod in sys.modules.items() if name in modules}

    imp_function = generated_globals[bts][imp]

    def halt_imp_function(module, global_scope, local_scope, attributes, level):
        if module not in modules:
            raise ModuleNotFoundError(f'{repr(module)} halted')
        return imp_function(module, global_scope, local_scope, attributes, level)

    generated_globals[bts][imp] = halt_imp_function
    return generated_globals


def default_globals(main: str):
    return create_globals(main, None, None)


def sandbox_globals(main: str):
    bts = '__builtins__'
    builtins = globals()[bts].copy() if isinstance(globals()[bts], dict) else vars(globals()[bts]).copy()
    allowed_builtins = {*builtins.keys()}
    allowed_builtins.remove('open')
    return create_globals(
        main,
        allowed_builtins,
        {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'},
        True
    )
