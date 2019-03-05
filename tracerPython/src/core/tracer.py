import collections
import message
import multiprocessing as mp
import sys
import types
from . import scope
from .inspector import Inspector
from .io import HookedInput, HookedPrint
from .util import ExceptionUtil, FrameUtil


class Tracer:
    """
    Traces python code and analyses its state after every instruction.
    """

    @staticmethod
    def init_run(name: str, code: str, sandbox: bool, action_queue: mp.Queue, event_queue: mp.Queue):
        Tracer(name, code, sandbox, action_queue, event_queue).run()

    def __init__(self, name: str, code: str, sandbox: bool, action_queue: mp.Queue, event_queue: mp.Queue):
        self._name = name
        self._code = code
        self._sandbox = sandbox
        self._action_queue = action_queue
        self._event_queue = event_queue

    def run(self):
        frame_processor = FrameProcessor(self._name, self._action_queue, self._event_queue)

        globals_builder, modules_halter = scope.default_scope_composers(self._name)\
            if not self._sandbox\
            else scope.sandbox_scope_composers(self._name)
        globals_builder.builtin('input', HookedInput(frame_processor.input_hook))
        globals_builder.builtin('print', HookedPrint(frame_processor.print_hook))
        scope_instance = modules_halter.apply(globals_builder.build())

        try:
            self._action_queue.get()
            compiled = compile(self._code, scope_instance[scope.Globals.FILE], 'exec')
            self._event_queue.put(message.Message(message.Event.STARTED))
            sys.settrace(frame_processor.trace)
            exec(compiled, scope_instance)
        except Exception as e:
            exception_dump = ExceptionUtil.dump(e, remove_lines=(1,))
            self._event_queue.put(message.Message(message.Event.THREW, exception_dump))
        finally:
            sys.settrace(None)


class FrameProcessor:
    """
    Read action queue waiting for actions, process the frames and write the events in the queue.
    """

    def __init__(self, name: str, action_queue: mp.Queue, event_queue: mp.Queue):
        self._name = name
        self._action_queue = action_queue
        self._event_queue = event_queue
        self._inspector = Inspector()

        # frame common info
        self._exec_call_frame = None
        self._inspected_frame_count = 0

        # hooks attributes
        self._input_cache = collections.deque()

    def trace(self, frame: types.FrameType, event: str, args):
        if not FrameUtil.is_file(frame, self._name) or not FrameUtil.is_traceable(event):
            return self.trace

        self._exec_call_frame = FrameUtil.previous(frame) if self._inspected_frame_count == 0 else self._exec_call_frame
        self._inspected_frame_count += 1

        while True:
            action = self._action_queue.get()

            # hold action (does not consume the frame)
            if action.name == message.Action.INPUT:
                self._input_cache.append(action.value)
                continue

            # progressive actions
            if action.name == message.Action.STEP:
                data = self._inspector.inspect(frame, event, args, self._exec_call_frame)
                self._event_queue.put(message.Message(message.Event.INSPECTED, data))
            elif action.name == message.Action.STOP:
                self._event_queue.put(message.Message(message.Event.INSPECTED, None))
                return None
            break

        return self.trace

    def input_hook(self, prompt: str):
        self._event_queue.put(message.Message(message.Event.PRINTED, prompt))

        # cached input
        if len(self._input_cache) > 0:
            return self._input_cache.popleft()

        # missing input
        while True:
            action = self._action_queue.get()
            if action.name == message.Action.INPUT:
                return action.value
            if action.name == message.Action.STOP:
                # add stop message in the queue again for stacked inputs until reach frame tracer
                self._action_queue.put(action)
                return ''
            self._event_queue.put(message.Message(message.Event.LOCKED, 'input'))

    def print_hook(self, text: str):
        self._event_queue.put(message.Message(message.Event.PRINT, text))
