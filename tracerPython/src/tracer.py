import sys
import types

import scope


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    def __init__(self, script: str):
        """
        Initialize the tracer with the python script.

            :param script: python script
        """
        self.script = script
        self.lines = script.splitlines() if len(script) > 0 else ['']

    def start(self):
        """
        Start to trace the script.
        """
        script_globals = scope.Globals()\
            .property(scope.Globals.FILE, '<script>')\
            .builtin('compile', None)\
            .builtin('exec', None)\
            .builtin('open', None)\
            .build()

        try:
            sys.settrace(self._trace)
            exec(compile(self.script, script_globals[scope.Globals.FILE], 'exec'), script_globals)
            print('done')
        except Exception as e:
            print('error')
            print(str(e))
        finally:
            sys.settrace(None)

    def _trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.

            :param frame: current frame stack
            :param event: current code event, one of: 'call', 'line', 'return', 'exception' or 'opcode'
            :param args: context arguments in some code states
        """
        print(self.lines[frame.f_lineno - 1])
        return self._trace
