import sys
import types


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
        try:
            sys.settrace(self._trace)
            exec(compile(self.script, '<script>', 'exec'), {}, {})
            print('done')
        except Exception as e:
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
