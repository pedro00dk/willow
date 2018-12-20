import sys
import queue
import threading
import types

import inspector
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

        # threading control
        self._command_queue = None
        self._command_queue = None
        self._trace_thread = None

    def start(self):
        """
        Create a thread to trace the script.
        Another thread is necessary because of blocking command link input calls in the script.
        """
        self._command_queue = queue.Queue()
        self._result_queue = queue.Queue()
        self._trace_thread = threading.Thread(
            target=self._trace_coroutine,
            args=(self._command_queue, self._result_queue)
        )
        self._trace_thread.start()

    def _trace_coroutine(self, command_queue: queue.Queue, result_queue: queue.Queue):
        """
        Starts the tracing coroutine.
        Configure the scope, set the trace function and execute the script.

            :param command_queue: queue to send commands
            :param result_queue: queue to receive inspection results
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        script_inspector = inspector.Inspector(self._name, self._lines, command_queue, result_queue)
        try:
            sys.settrace(script_inspector.trace)
            exec(compile(self._script, script_scope[scope.Globals.FILE], 'exec'), script_scope)
            print('done')
        except Exception as e:
            print('error')
            print(str(e))
        finally:
            sys.settrace(None)
