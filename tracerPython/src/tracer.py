import multiprocessing as mp
import sys
import types

import inspector
import scope


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    @staticmethod
    def init_run(name: str, script: str, sandbox: bool, command_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the Tracer and run it.
        This static method shall be used when spawn a new process.

            :params ref(__init__):
        """
        Tracer(name, script, sandbox, command_queue, result_queue).run()

    def __init__(self, name: str, script: str, sandbox: bool, command_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the tracer with the python script.

            :param name: script name
            :param script: python script
            :param sandbox: use sandbox scope instead of default scope
            :param command_queue: queue to send commands to inspector
            :param result_queue: queue to receive inspection results
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._command_queue = command_queue
        self._result_queue = result_queue
        self._lines = self._script.splitlines() if len(script) > 0 else ['']

    def run(self):
        """
        Run the tracing inspector.
        Configure the scope, set the trace function and execute the script.
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        script_inspector = inspector.Inspector(self._name, self._lines, self._command_queue, self._result_queue)
        try:
            sys.settrace(script_inspector.trace)
            exec(compile(self._script, script_scope[scope.Globals.FILE], 'exec'), script_scope)
            print('done')
        except Exception as e:
            print('error')
            print(str(e))
        finally:
            sys.settrace(None)


class TracerStepper:
    """
    Provide basic stepping in the tracer.
    """

    def __init__(self, name: str, script: str, sandbox: bool):
        """
        Initialize the TracerStepper and prepare the internal tracer for running in another process.

            :params ref(Tracer.__init__):
        """
        self._command_queue = mp.Queue()
        self._result_queue = mp.Queue()
        self._tracer_process = mp.Process(
            target=Tracer.init_run,
            args=(name, script, sandbox, self._command_queue, self._result_queue)
        )

    def start(self):
        """
        Start the tracer in a new process
        """
        self._tracer_process.start()

