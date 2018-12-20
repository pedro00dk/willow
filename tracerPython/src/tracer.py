import multiprocessing as mp
import sys
import types

import events
import inspector
import scope


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    # tracer events
    class Events:
        START = 'start'
        START = 'start'

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
            compiled = compile(self._script, script_scope[scope.Globals.FILE], 'exec')
            # sync
            self._result_queue.put(events.new(Tracer.Events.START))
            self._action_queue.get()
            #
            sys.settrace(script_inspector.trace)
            exec(compiled, script_scope)
            print('done')
        except Exception as e:
            # sync
            self._result_queue.put(events.new(Tracer.Events.START))
            self._action_queue.get()
            #
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
        Store tracer parameters for process spawning.

            :params ref(Tracer.__init__):
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._action_queue = None
        self._result_queue = None
        self._tracer_process = None

    def is_running(self):
        """
        Return if the tracer is running.

            :return: if tracer is running
        """
        return self._tracer_process is not None

    def start(self):
        """
        Start the tracer in a new process.

            :raise: AssertionError - if tracer already running
        """
        if self.is_running():
            raise AssertionError('tracer already running')

        self._action_queue = mp.Queue()
        self._result_queue = mp.Queue()
        self._tracer_process = mp.Process(
            target=Tracer.init_run,
            args=(self._name, self._script, self._sandbox, self._action_queue, self._result_queue)
        )
        self._tracer_process.start()

        # sync
        self._result_queue.get()
        self._action_queue.put(events.new(Tracer.Events.START))
        #

    def stop(self):
        """
        Stop the tracer process and queues.

            :raise: AssertionError - if tracer already stopped
        """
        if not self.is_running():
            raise AssertionError('tracer already stopped')

        self._tracer_process.terminate()
        self._tracer_process.join()
        self._action_queue.close()
        self._result_queue.close()
        self._tracer_process = None
        self._action_queue = None
        self._result_queue = None
