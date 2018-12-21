import multiprocessing as mp
import sys
import types

import events


class Inspector:
    """
    Control the script tracing progression by receiving commands.
    """

    TRACEABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, name: str, lines: list, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the tracer controller with the script name and lines.

            :param name: script name
            :param line: script lines
            :param action_queue: queue to read actions
            :param result_queue: queue to write results
        """
        self._name = name
        self._lines = lines
        self._action_queue = action_queue
        self._result_queue = result_queue

        # inspection properties
        self.exec_call_frame = None
        self.inspected_frame_count = 0

    def is_script_file(self, frame: types.FrameType):
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
        if not self.is_script_file(frame) or not self.is_traceable_event(event):
            return self.trace

        self.exec_call_frame = frame.f_back if self.inspected_frame_count == 0 else self.exec_call_frame
        self.inspected_frame_count += 1

        action = self._action_queue.get()

        if action.name == events.Actions.STEP:
            self._result_queue.put(events.Event(events.Results.DATA, self.inspect_state(frame, event, args)))

        return self.trace

    # inspection methods

    def inspect_state(self, frame: types.FrameType, event: str, args):
        line = frame.f_lineno
        text = self._lines[frame.f_lineno - 1]
        stack_frames, stack_data, stack_depth = self.inspect_stack(frame)
        finish = event == 'return' and stack_depth <= 1
        return {
            'event': event,
            'line': line,
            'text': text,
            'stack_data': stack_data,
            'stack_depth': stack_depth,
            'finish': finish
        }

    def inspect_stack(self, frame: types.FrameType):
        current_frame = frame
        stack_frames = []
        while current_frame != self.exec_call_frame:
            stack_frames.append(current_frame)
            current_frame = current_frame.f_back

        stack_frames = [frame for frame in stack_frames if self.is_script_file(frame)]
        stack_data = [{'line': frame.f_lineno - 1, 'text': self._lines[frame.f_lineno - 1]} for frame in stack_frames]
        stack_depth = len(stack_frames)
        return stack_frames, stack_data, stack_depth

    def inspect_heap(self, frame: types.FrameType):
        pass
