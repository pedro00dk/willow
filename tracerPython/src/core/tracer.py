import multiprocessing as mp
import sys
import types

import events
from . import inspector
from . import scope


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    @staticmethod
    def init_run(name: str, script: str, sandbox: bool, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the Tracer and run it.
        This static method shall be used when spawn a new process.

            :params ref(__init__):
        """
        Tracer(name, script, sandbox, action_queue, result_queue).run()

    def __init__(self, name: str, script: str, sandbox: bool, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the tracer with the python script.

            :param name: script name
            :param script: python script
            :param sandbox: use sandbox scope instead of default scope
            :param action_queue: queue to send actions to inspector
            :param result_queue: queue to receive inspection results
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._action_queue = action_queue
        self._result_queue = result_queue
        self._lines = self._script.splitlines() if len(script) > 0 else ['']

    def run(self):
        """
        Run the tracing inspector.
        Configure the scope, set the trace function and execute the script.
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        script_inspector = inspector.Inspector(self._name, self._lines, self._action_queue, self._result_queue)

        try:
            action = self._action_queue.get()
            compiled = compile(self._script, script_scope[scope.Globals.FILE], 'exec')
            self._result_queue.put(events.Event(events.Results.STARTED))
            sys.settrace(script_inspector.trace)
            exec(compiled, script_scope)
        except Exception as e:
            self._result_queue.put(events.Event(events.Results.ERROR, str(e)))
        finally:
            sys.settrace(None)
