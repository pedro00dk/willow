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
    def init_run(action_queue: mp.Queue, event_queue: mp.Queue):
        Tracer(action_queue, event_queue).run()

    def __init__(self, action_queue: mp.Queue, event_queue: mp.Queue):
        self._action_queue = action_queue
        self._event_queue = event_queue

    def run(self):
        try:
            action = self._action_queue.get()
            if action.name == message.Action.STOP:
                return
            elif action.name != message.Action.START:
                raise Exception('unexpected action')

            main = action.value['main']
            code = action.value['code']
            frame_processor = FrameProcessor(main, self._action_queue, self._event_queue)
            generated_globals = scope.sandbox_globals(main)
            generated_globals['__builtins__']['input'] = HookedInput(frame_processor.input_hook)
            generated_globals['__builtins__']['print'] = HookedPrint(frame_processor.print_hook)
            compiled = compile(code, main, 'exec')
            self._event_queue.put(message.Message(message.Event.STARTED))
            sys.settrace(frame_processor.trace)
            exec(compiled, generated_globals)
        except Exception as e:
            exception_dump = ExceptionUtil.dump(e, remove_lines=(1,))
            self._event_queue.put(message.Message(message.Event.THREW, exception_dump))
        finally:
            sys.settrace(None)


class FrameProcessor:
    """
    Read action queue waiting for actions, process the frames and write the events in the queue.
    """

    def __init__(self, main: str, action_queue: mp.Queue, event_queue: mp.Queue):
        self._main = main
        self._action_queue = action_queue
        self._event_queue = event_queue
        self._inspector = Inspector()

        # base frame (exec call)
        self._exec_call_frame = None

        # hooks attributes
        self._input_cache = collections.deque()

    def trace(self, frame: types.FrameType, event: str, args):
        if not FrameUtil.is_file(frame, self._main) or not FrameUtil.is_traceable(event):
            return self.trace
        if self._exec_call_frame is None:
            self._exec_call_frame = FrameUtil.previous(frame)

        while True:
            action = self._action_queue.get()
            if action.name == message.Action.STOP:
                return None
            elif action.name == message.Action.STEP:
                frame = self._inspector.inspect(frame, event, args, self._exec_call_frame)
                self._event_queue.put(message.Message(message.Event.INSPECTED, frame))
                # break loop and go to next trace call
                break
            elif action.name == message.Action.INPUT:
                self._input_cache.extend(action.value)
                # read next action without breaking the loop
                continue
            else:
                raise Exception('unexpected action')

        return self.trace

    def input_hook(self, prompt: str):
        self._event_queue.put(message.Message(message.Event.PRINTED, prompt))

        while True:
            if len(self._input_cache) > 0:
                return self._input_cache.popleft()

            action = self._action_queue.get()
            print(action.__dict__)
            if action.name == message.Action.STOP:
                # add stop message in the queue again for stacked inputs until reach trace
                self._action_queue.put(action)
                self._input_cache.append('')
            elif action.name == message.Action.INPUT:
                # read next action without breaking the loop
                self._input_cache.extend(action.value)
                sys.stdout.write(str(len(self._input_cache)))
            elif action.name == message.Action.STEP:
                # do not throw exception (will send LOCKED event)
                pass
            else:  # stack action or unknown actions
                raise Exception('unexpected action')

            if len(self._input_cache) == 0:
                self._event_queue.put(message.Message(message.Event.LOCKED, 'input'))

    def print_hook(self, text: str):
        self._event_queue.put(message.Message(message.Event.PRINTED, text))
