import multiprocessing as mp
import sys
import types

import events
from . import scope
from .evaluator import Evaluator
from .inspector import Inspector
from .util import FrameUtil, ExceptionUtil


class Tracer:
    """
    Traces python script and analyses its state after every instruction.
    """

    @staticmethod
    def init_run(name: str, script: str, sandbox: bool, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the tracer and run it in a single function, usefull to start the tracer in a separated process.
        """
        Tracer(name, script, sandbox, action_queue, result_queue).run()

    def __init__(self, name: str, script: str, sandbox: bool, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the tracer with the script name, python script and sandbox flag.
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._action_queue = action_queue
        self._result_queue = result_queue
        self._lines = self._script.splitlines() if len(script) > 0 else ['']

    def run(self):
        """
        Configures the scope and runs the tracer, giving the tracing control to the frame processor.
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        frame_processor = FrameProcessor(self._name, self._lines, self._action_queue, self._result_queue)

        try:
            action = self._action_queue.get()
            compiled = compile(self._script, script_scope[scope.Globals.FILE], 'exec')
            self._result_queue.put(events.Event(events.Results.STARTED))
            sys.settrace(frame_processor.trace)
            exec(compiled, script_scope)
        except Exception as e:
            exception_dump = ExceptionUtil.dump(e)
            self._result_queue.put(events.Event(events.Results.ERROR, exception_dump))
        finally:
            sys.settrace(None)


class FrameProcessor:
    """
    Read action queue waiting for actions, process the frames and write the results in the queue. 
    """

    def __init__(self, name: str, lines: list, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initializes the frame processor with the script name, lines and queues.
        """
        self._name = name
        self._lines = lines
        self._action_queue = action_queue
        self._result_queue = result_queue

        # frame common info
        self._exec_call_frame = None
        self._inspected_frame_count = 0

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.
        """
        if not FrameUtil.is_file(frame, self._name) or not FrameUtil.is_traceable(event):
            return self.trace

        self._exec_call_frame = FrameUtil.previous(frame) if self._inspected_frame_count == 0 else self._exec_call_frame
        self._inspected_frame_count += 1

        while True:
            action = self._action_queue.get()

            # hold actions
            if action.name == events.Actions.EVAL:
                expression = action.value['expression']
                inspect = action.value['inspect']

                # evaluate first and then inspect state
                product = Evaluator.evaluate(frame, expression)
                data = Inspector.inspect(frame, event, args, self._exec_call_frame) if inspect else {}

                self._result_queue.put(events.Event(events.Results.PRODUCT, {**data, **product}))
                continue

            # progressive actions
            if action.name == events.Actions.STEP:
                data = Inspector.inspect(frame, event, args, self._exec_call_frame)
                self._result_queue.put(events.Event(events.Results.DATA, data))
            elif action.name == events.Actions.QUIT:
                self._result_queue.put(events.Event(events.Results.DATA, {}))
            break

        return self.trace
