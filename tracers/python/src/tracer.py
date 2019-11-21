import sys
import types
import scope
import traceback
import inspector


class Tracer:
    """
    Traces python source and analyses its state after each instruction.
    """

    def __init__(self, trace: dict):
        self._filename = '<script>'
        self._source = trace['source']
        self._input = trace['input'].splitlines()
        self._steps = trace['steps']

        self._inspector = inspector.Inspector()
        self._result = None
        self._current_step = 0

        self._exec_call_frame = None
        self._input_index = 0
        self._input_miss = False
        self._print_cache = []

    def run(self):
        self._result = {'steps': []}

        allowed_builtins = globals()['__builtins__'].copy() if isinstance(globals()['__builtins__'], dict) else \
            vars(globals()['__builtins__']).copy()
        allowed_builtins = {*allowed_builtins.keys()}
        allowed_builtins.remove('open')
        over_builtins = {'input': scope.HookedInput(self._input_hook), 'print': scope.HookedPrint(self._print_hook)}
        allowed_modules = {'copy', 'datetime', 'functools', 'itertools', 'math', 'random', 're', 'string', 'time'}
        sandbox_globals = scope.create_globals(allowed_builtins, over_builtins, allowed_modules, True)

        try:
            compiled = compile(self._source, self._filename, 'exec')
            sys.settrace(self._trace)
            exec(compiled, sandbox_globals)

            # raising an exception is the only way to stop an exec call.

        except TracerStopException as e:
            # tracer controlled exceptions (not tracer or traced program exceptions, no traceback at all)
            self._result['steps'].append({'threw': {'cause': str(e)}})

        except Exception as e:
            # traced program exceptions or bugs in the tracer (clearly distincted by their tracebacks)
            type_ = type(e).__name__
            traceback_ = traceback.format_exception(type(e), e, e.__traceback__)
            traceback_.pop(1)  # exec call traceback line (assuming it is an exception from the traced code)
            self._result['steps'].append({'threw': {'exception': {'type': type_, 'traceback': traceback_}}})

        finally:
            sys.settrace(None)

        return self._result

    TRACERABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def _trace(self, frame: types.FrameType, event: str, args):
        if not frame.f_code.co_filename == self._filename or not event in Tracer.TRACERABLE_EVENTS:
            return self._trace
        if self._exec_call_frame is None:
            self._exec_call_frame = frame.f_back

        self._current_step += 1

        if self._current_step > self._steps:
            raise TracerStopException(f'reached maximum step: {self._steps}')
        if self._input_miss:
            raise TracerStopException('program requires input')

        snapshot = self._inspector.inspect(frame, event, args, self._exec_call_frame)
        prints = self._print_cache
        self._print_cache = []
        self._result['steps'].append({'snapshot': snapshot, 'prints': prints})

        return self._trace

    def _input_hook(self, prompt: str):
        self._print_cache.append(prompt)
        if self._input_index >= len(self._input):
            # cannot raise TracerStopException here because it may be captured by the program
            # enable flag to raise exception in _trace function
            self._input_miss = True
            return None
        self._input_index += 1
        return self._input[self._input_index - 1]

    def _print_hook(self, text: str):
        self._print_cache.append(text)


class TracerStopException(Exception):
    """
    TracerStopExceptions are used to get information of why the exec function call stops.
    These exceptions are created by the Tracer itself, and not caused by a traced program bug or raised exception.
    """
    pass
