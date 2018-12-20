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

    TRACEABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, name: str, lines: list):
        """
        Initialize the tracer controller with the script name and lines.

            :param name: script name
            :param line: script lines
        """
        self._name = name
        self._lines = lines

    def code_line(self, frame: types.FrameType):
        return self._lines[frame.f_lineno - 1] if self.is_base_file(frame) else None

    def is_base_file(self, frame: types.FrameType):
        return frame.f_code.co_filename == self._name
    
    def is_traceable_event(self, event: str):
        return event in TraceController.TRACEABLE_EVENTS

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.

            :param frame: current frame stack
            :param event: current code event, one of: 'call', 'line', 'return', 'exception' or 'opcode'
            :param args: context arguments in some code states
        """
        if not self.is_base_file(frame) or not self.is_traceable_event(event):
            return self.trace

        print(self.code_line(frame))

        return self.trace
