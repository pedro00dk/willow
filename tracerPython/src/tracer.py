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
        script_scope = scope.sandbox_scope('<script>')

        try:
            sys.settrace(self._trace)
            exec(compile(self.script, script_scope[scope.Globals.FILE], 'exec'), script_scope)
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
        print(frame.f_lineno, self.lines[frame.f_lineno - 1] if frame.f_code.co_filename ==
              '<script>' else frame.f_code.co_filename, args if args else args)
        return self._trace
