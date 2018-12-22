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
        """
        Check if the frame is from the main script file.

            :return: frame is from script file
        """
        return frame.f_code.co_filename == self._name

    def is_traceable_event(self, event: str):
        """
        Check if the frame event is traceable.

            :return: if is traceable
        """
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
        elif action.name == events.Actions.QUIT:
            self._result_queue.put(events.Event(events.Results.DATA, {}))

        return self.trace

    # inspection methods

    def inspect_state(self, frame: types.FrameType, event: str, args):
        """
        Inspect the application state.
        Analyse the stack and heap, collecting the objects.

            :params ref(trace):
            :return: dict with trace information
        """
        stack_frames, stack_lines = self.inspect_stack(frame)
        stack_refs, heap_graph = self.inspect_heap(stack_frames)
        finish = event == 'return' and len(stack_frames) == 1
        return {
            'event': event,
            'line': stack_lines[0]['line'],
            'text': stack_lines[0]['text'],
            'stack_lines': stack_lines,
            'stack_refs': stack_refs,
            'heap_graph': heap_graph,
            'finish': finish
        }

    def inspect_stack(self, frame: types.FrameType):
        """
        Inspect the application stack.

            :params ref(trace):
            :return: stack frames of script only
            :return: dict with frames names, lines and text
        """
        current_frame = frame
        frames = []
        while current_frame != self.exec_call_frame:
            frames.append(current_frame)
            current_frame = current_frame.f_back

        frames = [frame for frame in frames if self.is_script_file(frame)]
        lines = [
            {'name': frame.f_code.co_name, 'line': frame.f_lineno - 1, 'text': self._lines[frame.f_lineno - 1]}
            for frame in frames
        ]
        return frames, lines

    def inspect_heap(self, stack_frames: list):
        return None, None
