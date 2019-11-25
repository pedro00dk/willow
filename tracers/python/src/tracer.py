import inspector
import scope
import sys
import traceback
import types


class Tracer:
    """
    Traces python source and analyses its state after each instruction.
    """

    # set of traceable events, trace may produce events other than these in C calls
    TRACERABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, trace: dict):
        """
        Create the tracer with the trace dictionary, which contains the source to be inspected, its input and the
        maximum of steps to be evaluated.

        > trace: `dict`: source, input and steps, the two firsts are `str` and the later `int`.
        """

        self._filename = '<script>'
        self._source = trace['source']
        self._input = trace['input'].splitlines()
        self._steps = trace['steps']

        self._inspector = inspector.Inspector()
        self._result = None
        self._current_step = 0

        self._exec_call_frame = None
        self._input_index = 0
        self._print_cache = []

    def run(self):
        """
        Run the received source through an `exec` call. An unique sandboxed global scope is created to the call. The
        program is analysed each step by the _trace function, which is set in sys.settrace.
        The trace program may raise an exception. These exceptions reach this function scope and are treated by adding
        an extra step to the tracer result.
        The tracer itself also raise exceptions (`TraceStopException`) to stop the tracing process because it is the
        only way to stop an `exec` call. It can be done only in the `_trace` function, because its calls do not pass
        through the traced program, and, therefore, cannot be captured.
        The tracer might also raise unexpected exceptions, that will the be captured and returned the same way as the
        formers, being easily distinguishable by their tracebacks.

        > return `dict`: the result JSON.
        """

        self._result = {'steps': []}

        allowed_builtins = globals()['__builtins__'].copy() if isinstance(globals()['__builtins__'], dict) else \
            vars(globals()['__builtins__']).copy()
        allowed_builtins = {*allowed_builtins.keys()}
        allowed_builtins.remove('open')
        over_builtins = {'input': self._input_hook, 'print': self._print_hook}
        allowed_modules = {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'}
        sandbox_globals = scope.create_globals(allowed_builtins, over_builtins, allowed_modules, True)
        try:
            compiled = compile(self._source, self._filename, 'exec')
            sys.settrace(self._trace)
            exec(compiled, sandbox_globals)
        except TracerStopException as e:
            threw = {'cause': str(e)}
            prints = self._print_cache
            self._result['steps'].append({'threw': threw, 'prints': prints})
        except Exception as e:
            type_ = type(e).__name__
            traceback_ = traceback.format_exception(type(e), e, e.__traceback__)
            traceback_.pop(1)  # exec call traceback line (assuming it is an exception from the traced code)
            threw = {'exception': {'type': type_, 'traceback': traceback_}}
            prints = self._print_cache
            self._result['steps'].append({'threw': threw, 'prints': prints})
        finally:
            sys.settrace(None)

        return self._result

    def _trace(self, frame: types.FrameType, event: str, args):
        """
        Runs the inspections and check conditions each step of the traced program. Actually even frames of the run and
        exec functions are passed to this function, as it starts processing in the sys.settrace call.
        However these frames are ignored when the _filename is checked, effectively processing only lines from the
        traced program.
        This function may want to stop the tracing process then the program reaches the maximum number of steps, it can
        only be done by raising exceptions to stop the exec call.

        The arguments are provided by the sys.settrace function.

        > frame: `frame`: frame where the stack and heap data will be extracted from.  
        > event: `str`: type of event the frame is refering to, one of `['call', 'line', 'exception', 'return']`.  
        > args: `any[]`: list of arguments, usually only used in exception events (not used by the inspector).
        """

        if not frame.f_code.co_filename == self._filename or not event in Tracer.TRACERABLE_EVENTS:
            return self._trace
        if self._exec_call_frame is None:
            self._exec_call_frame = frame.f_back
        
        self._current_step += 1

        if self._current_step > self._steps:
            raise TracerStopException(f'reached maximum step: {self._steps}')

        snapshot = self._inspector.inspect(frame, event, self._exec_call_frame)
        prints = self._print_cache
        self._print_cache = []
        self._result['steps'].append({'snapshot': snapshot, 'prints': prints})

        return self._trace

    def _input_hook(self, prompt=''):
        """
        Simulate the API of the input function. Save the str(prompt) in the _print_cache and try to get input from the
        _input.

        > prompt: `any`: the input prompt.

        > return `str`: the result of the input hook.
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

        > values: `*any`: objects to build the print string, they are transformed through the `str` function.  
        > sep: `str`: separator string to be used between values.  
        > end: `str`: string to append to the end of the print string.
        """

        if sep is not None and not isinstance(sep, str):
            raise TypeError(f'sep must be None or a string, not {type(end)}')
        if end is not None and not isinstance(end, str):
            raise TypeError(f'end must be None or a string, not {type(end)}')

        sep = sep if sep is not None else ' '
        end = end if end is not None else '\n'
        text = f'{sep.join(str(value) for value in values)}{end}'
        self._print_cache.append(text)


class TracerStopException(Exception):
    """
    TracerStopExceptions are used to get information of why the exec function call stops. These exceptions are created
    by the Tracer itself, and not caused by a traced program bug or raised exceptions.
    """
    pass
