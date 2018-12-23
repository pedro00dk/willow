import queue
import functools

import events


class Input:
    """
    Redirects input as events over process connection queues.
    """

    def __init__(self, input_queue: queue.Queue, output_queue: queue.Queue):
        self._input_queue = input_queue
        self._output_queue = output_queue

    def __call__(self, prompt=''):
        prompt = str(prompt)
        self._output_queue.put(prompt)
        return self._input_queue.get()


class Print:
    """
    Redirects print as events over process connection queues.
    """

    def __init__(self, result_queue: queue.Queue):
        self.result_queue = result_queue

    def __call__(self, *values, sep=None, end=None):
        if sep is not None and not isinstance(sep, str):
            raise TypeError(f'sep must be None or a string, not {type(end)}')
        if end is not None and not isinstance(end, str):
            raise TypeError(f'end must be None or a string, not {type(end)}')

        sep = sep if sep is not None else ' '
        end = end if end is not None else '\n'
        values = (str(value) for value in values)
        text = f'{sep.join(values)}{end}'
        self.result_queue.put(events.Event(events.Results.PRINT, text))
