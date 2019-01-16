import collections
import multiprocessing as mp
import sys
import types

from constraints import Constraints
import message

from . import scope
from .inspector import Inspector
from .io import HookedInput, HookedPrint
from .util import ExceptionUtil, FrameUtil


class Tracer:
    """
    Traces python code and analyses its state after every instruction.
    """

    @staticmethod
    def init_run(name: str, code: str, constraints: Constraints, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the tracer and run it in a single function, useful to start the tracer in a separated process.
        """
        Tracer(name, code, constraints, action_queue, result_queue).run()

    def __init__(self, name: str, code: str, constraints: Constraints, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the tracer with the code name, python code and constraints.
        """
        self._name = name
        self._code = code
        self._constraints = constraints
        self._action_queue = action_queue
        self._result_queue = result_queue

    def run(self):
        """
        Configures the scope and runs the tracer, giving the tracing control to the frame processor.
        """
        frame_processor = FrameProcessor(self._name, self._constraints, self._action_queue, self._result_queue)

        globals_builder, modules_halter = scope.default_scope_composers(self._name)\
            if not self._constraints.is_sandbox()\
            else scope.sandbox_scope_composers(self._name)
        globals_builder.builtin('input', HookedInput(frame_processor.input_hook))
        globals_builder.builtin('print', HookedPrint(frame_processor.print_hook))
        scope_instance = modules_halter.apply(globals_builder.build())

        try:
            action = self._action_queue.get()
            compiled = compile(self._code, scope_instance[scope.Globals.FILE], 'exec')
            self._result_queue.put(message.Message(message.Result.STARTED))
            sys.settrace(frame_processor.trace)
            exec(compiled, scope_instance)
        except Exception as e:
            exception_dump = ExceptionUtil.dump(e, remove_lines=(1,))
            self._result_queue.put(message.Message(message.Result.ERROR, exception_dump))
        finally:
            sys.settrace(None)


class FrameProcessor:
    """
    Read action queue waiting for actions, process the frames and write the results in the queue. 
    """

    def __init__(self, name: str, constraints: Constraints, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the frame processor with the code name, constraints and queues.
        """
        self._name = name
        self._constraints = constraints
        self._action_queue = action_queue
        self._result_queue = result_queue

        # frame common info
        self._exec_call_frame = None
        self._inspected_frame_count = 0

        # hooks attributes
        self._input_cache = collections.deque()

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The code trace function.
        """
        if not FrameUtil.is_file(frame, self._name) or not FrameUtil.is_traceable(event):
            return self.trace

        self._exec_call_frame = FrameUtil.previous(frame) if self._inspected_frame_count == 0 else self._exec_call_frame
        self._inspected_frame_count += 1

        self._constraints.check_max_frames(self._inspected_frame_count)

        while True:
            action = self._action_queue.get()

            # hold action (does not consume the frame)
            if action.name == message.Action.INPUT:
                self._input_cache.append(action.value['input'])
                continue

            # progressive actions
            if action.name == message.Action.STEP:
                data = Inspector.inspect(frame, event, args, self._exec_call_frame)
                self._result_queue.put(message.Message(message.Result.DATA, data))
            elif action.name == message.Action.STOP:
                self._result_queue.put(message.Message(message.Result.DATA, {}))
            break

        return self.trace

    def input_hook(self, prompt: str):
        """
        Hook action for input implementations.
        """
        self._result_queue.put(message.Message(message.Result.PROMPT, prompt))

        # cached input
        if len(self._input_cache) > 0:
            return self._input_cache.popleft()

        # missing input
        while True:
            action = self._action_queue.get()
            if action.name == message.Action.INPUT:
                return action.value['input']
            if action.name == message.Action.STOP:
                # add stop message in the queue again for stacked inputs until reach frame tracer
                self._action_queue.put(action)
                return ''
            self._result_queue.put(message.Message(message.Result.LOCKED, 'input locked, skipping action'))

    def print_hook(self, text: str):
        """
        Hook action for input implementations.
        """
        self._result_queue.put(message.Message(message.Result.PRINT, text))
