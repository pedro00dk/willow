import multiprocessing as mp
import sys
import types


class Inspector:
    """
    Control the script tracing progression by receiving commands.
    """

    TRACEABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, name: str, lines: list, command_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the tracer controller with the script name and lines.

            :param name: script name
            :param line: script lines
            :param command_queue: queue to read commands
            :param result_queue: queue to write results
        """
        self._name = name
        self._lines = lines
        self._command_queue = command_queue
        self._result_queue = result_queue

    def code_line(self, frame: types.FrameType):
        return self._lines[frame.f_lineno - 1] if self.is_base_file(frame) else None

    def is_base_file(self, frame: types.FrameType):
        return frame.f_code.co_filename == self._name

    def is_traceable_event(self, event: str):
        return event in Inspector.TRACEABLE_EVENTS

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.

            :param frame: current frame stack
            :param event: current code event, one of: 'call', 'line', 'return', 'exception' or 'opcode'
            :param args: context arguments in some code states
        """
        if not self.is_base_file(frame) or not self.is_traceable_event(event):
            return self.trace
        
        print(self.inspect_state(frame, event, args))

        return self.trace

    # inspection methods

    def inspect_state(self, frame: types.FrameType, event: str, args):
        line = frame.f_lineno
        text = self.code_line(frame)
        return {
            'event': event,
            'line': line,
            'text': text,
        }

    def inspect_stack(self, frame: types.FrameType):
        pass

    def inspect_heap(self, frame: types.FrameType):
        pass
