import sys
import traceback
import types

from . import inspector, scope


class Tracer:
    """
    Trace python requests.
    """

    # set of traceable events, trace may produce events other than these in C calls
    TRACERABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, request: dict):
        """
        Create the tracer with the request, which contains the program source, input and steps to run.
        - request: `dict`: request
        """
        self._source = request['source']
        self._input = request['input'].splitlines()
        self._steps = request['steps']
        self._inspector = inspector.Inspector()
        self._response = None
        self._current_step = 0
        self._exec_frame = None
        self._input_index = 0
        self._print_cache = []
        self._trace_functions = []

    def run(self):
        """
        Run the source and inspect the debugee program state.
        The debugee program runs in an unique sandboxed global scope.
        The execution is analysed by the _trace(), which is set in sys.settrace().
        The debugee program may raise exceptions. If an exception reaches the run() scope, it is treated by adding an
        extra error step to the tracer response.
        The _trace() itself may also raise TraceStopExceptions to stop the tracing process, the only way to stop exec().
        _input_hook(), _print_hook() and _open_hook() can also raise exceptions if the conditions are not satisfied,
        but these exceptions can be captured and processed in the debugee program.
        run() and _trace() might also raise unexpected exceptions, that will the be captured and returned the same way
        as exceptions from the debugee program, being easily distinguishable by their tracebacks.
        - return `dict`: the tracer response
        """
        self._response = {'steps': []}
        overide_builtins = {'input': self._input_hook, 'print': self._print_hook, 'open': self._open_hook}
        allowed_modules = {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'}
        sandbox_globals = scope.create_globals(None, overide_builtins, allowed_modules, True)

        try:
            compiled = compile(self._source, '<script>', 'exec')
            self._trace_functions.append(self._trace)
            self._trace_functions.append(sys.gettrace())
            sys.settrace(self._multi_trace)
            exec(compiled, sandbox_globals)

        except TracerStopException as e:
            error = {'cause': str(e)}
            self._response['steps'].append({'error': error, 'print': ''.join(self._print_cache)})

        except Exception as e:
            type_ = type(e).__name__
            traceback_ = traceback.format_exception(type(e), e, e.__traceback__)
            filtered_traceback = filter(lambda line: not line.startswith(f'  File "{__file__}"'), traceback_)
            error = {'exception': {'type': type_, 'traceback': ''.join(filtered_traceback)}}
            self._response['steps'].append({'error': error, 'print': ''.join(self._print_cache)})

        finally:
            if self._trace in self._trace_functions:
                self._trace_functions.remove(self._trace)

        return self._response

    def _multi_trace(self, frame: types.FrameType, event: str, args):
        """
        The multi trace is used to allow multiple tracer functions run at once.
        Since both tracer and debugger use sys.settrace to analyse code, the trace function overwrite the debugger tracer.
        This prevents the debugger to work properly.
        This function multiplexes the local tracer and the debugger tracer, allowing both to run correctly.
        """
        self._trace_functions = [trace(frame, event, args) for trace in self._trace_functions if trace is not None]
        return self._multi_trace if len(self._trace_functions) > 1 else \
            self._trace_functions.pop() if len(self._trace_functions) == 1 else None

    def _trace(self, frame: types.FrameType, event: str, args):
        """
        Trace the frame and its event.
        Actually, even frames of run() and exec() are passed to _trace(), as it starts processing in sys.settrace().
        However these frames are ignored when _filename is checked, tracing only frames of the debugee program.
        _trace() may stop the tracing process if the program reaches the maximum number of steps, it is done by raising
        a TraceStopException to stop exec().
        This trace implementation skips the first event of a program.
        - frame: `frame`: frame where the state data will be extracted from
        - event: `str`: frame event type, one of: call, line, exception or return
        - args: `any | any[t]`: return object if event is return or exception data if event is exception
        """
        if not frame.f_code.co_filename == '<script>' or not event in Tracer.TRACERABLE_EVENTS:
            return self._trace
        if self._exec_frame is None:
            self._exec_frame = frame.f_back
            return self._trace
        if self._current_step >= self._steps:
            raise TracerStopException(f'Program too long, maximum steps allowed: {self._steps}')

        self._current_step += 1
        snapshot = self._inspector.inspect(frame, event, args, self._exec_frame)
        self._response['steps'].append({'snapshot': snapshot, 'print': ''.join(self._print_cache)})
        self._print_cache = []
        return self._trace

    def _input_hook(self, prompt=''):
        """
        Simulate the API of the input function. Save the str(prompt) in the _print_cache and try to get input from the
        _input.
        - prompt: `any`: the input prompt
        - return `str`: the result of the input hook
        """
        self._print_cache.append(str(prompt))
        if self._input_index >= len(self._input):
            raise EOFError('EOF when reading a line')
        self._input_index += 1
        return self._input[self._input_index - 1]

    def _print_hook(self, *values, sep=None, end=None):
        """
        Simulate the API of the print function. Process the print arguments, build the print string and saves the
        result in the _print_cache.
        - values: `*any`: objects to build the print string, they are transformed through the `str` function
        - sep: `str`: separator string to be used between values
        - end: `str`: string to append to the end of the print string
        """
        if sep is not None and not isinstance(sep, str):
            raise TypeError(f'sep must be None or a string, not {type(end)}')
        if end is not None and not isinstance(end, str):
            raise TypeError(f'end must be None or a string, not {type(end)}')
        sep = sep if sep is not None else ' '
        end = end if end is not None else '\n'
        text = f'{sep.join(str(value) for value in values)}{end}'
        self._print_cache.append(text)

    def _open_hook(self, *args, **kwargs):
        """
        Hook to advert the debugee program that the builtin open() is not supported.
        """
        raise FileNotFoundError('builtin open() is not supported, use input() and print() for IO')


class TracerStopException(Exception):
    """
    Exception used to stop exec().
    """

    pass
