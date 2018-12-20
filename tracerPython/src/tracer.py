import sys


class Tracer:
    """
    Trace python code and analyses its state after every instruction
    """

    def __init__(self, script):
        """
        Initialize the tracer with the python script
        """
        self.script = script
        self.lines = script.splitlines() if len(script) > 0 else ['']

    def start(self):
        """
        Start to trace the script
        """
        try:
            sys.settrace(self._dispatch)
            exec(compile(self.script, '<script>', 'exec'), {}, {})
            print('done')
        except Exception as e:
            print(str(e))
        finally:
            sys.settrace(None)

    def _dispatch(self, frame, event, args):
        print(self.lines[frame.f_lineno - 1])
        return self._dispatch
