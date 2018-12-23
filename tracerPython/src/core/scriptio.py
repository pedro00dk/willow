import functools
import types


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
