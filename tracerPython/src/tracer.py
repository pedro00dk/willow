import sys
import types

import scope


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    def __init__(self, name: str, script: str, sandbox: bool):
        """
        Initialize the tracer with the python script.

            :param name: script name
            :param script: python script
            :param sandbox: use sandbox scope instead of default scope
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._lines = self._script.splitlines() if len(script) > 0 else ['']
        self._controller = TraceController(self._name, self._lines)

    def start(self):
        """
        Start to trace the script.
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        try:
            sys.settrace(self._controller.trace)
            exec(compile(self._script, script_scope[scope.Globals.FILE], 'exec'), script_scope)
            print('done')
        except Exception as e:
            print('error')
            print(str(e))
        finally:
            sys.settrace(None)


class TraceController:
    """
    Control the script tracing progression by receiving commands.
    """

    def __init__(self, name: str, lines: list):
        """
        Initialize the tracer controller with the script name and lines.

            :param name: script name
            :param line: script lines
        """
        self._name = name
        self._lines = lines

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.

            :param frame: current frame stack
            :param event: current code event, one of: 'call', 'line', 'return', 'exception' or 'opcode'
            :param args: context arguments in some code states
        """
        print(frame.f_lineno, self._lines[frame.f_lineno - 1] if frame.f_code.co_filename ==
              self._name else frame.f_code.co_filename, args if args else args)
        return self.trace
