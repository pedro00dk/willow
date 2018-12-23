import multiprocessing as mp

import events
import tracer


class TracerBroker:
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

    def is_tracer_running(self):
        """
        Return if the tracer is running.

            :return: if tracer is running
        """
        return self._tracer_process is not None

    def start(self):
        """
        Start the tracer in a new process.

            :raise: AssertionError - if tracer already running
            :return: list of results until start
        """
        if self.is_tracer_running():
            raise AssertionError('tracer already running')

        self._action_queue = mp.Queue()
        self._result_queue = mp.Queue()
        self._tracer_process = mp.Process(
            target=tracer.Tracer.init_run,
            args=(self._name, self._script, self._sandbox, self._action_queue, self._result_queue)
        )
        self._tracer_process.start()

        self._action_queue.put(events.Event(events.Actions.START))
        result = self._result_queue.get()

        if result.name == events.Results.ERROR:
            self.stop()

        print(result.name, result.value)
        return [result]

    def stop(self):
        """
        Stop the tracer process and queues.

            :raise: AssertionError - if tracer already stopped
        """
        if not self.is_tracer_running():
            raise AssertionError('tracer already stopped')

        self._action_queue.put(events.Event(events.Actions.QUIT))

        self._tracer_process.terminate()
        self._tracer_process.join()
        self._action_queue.close()
        self._result_queue.close()
        self._tracer_process = None
        self._action_queue = None
        self._result_queue = None

    def step(self, count:  int = 1):
        if not self.is_tracer_running():
            raise AssertionError('tracer not running')
        if count < 1:
            raise AssertionError('count smaller than 1')

        self._action_queue.put(events.Event(events.Actions.STEP, 1))
        result = self._result_queue.get()

        if result.name == events.Results.DATA and result.value['finish'] or result.name == events.Results.ERROR:
            self.stop()

        print(result.name, result.value)
        return [result]

    def eval(self, expression: str):
        if not self.is_tracer_running():
            raise AssertionError('tracer not running')

        self._action_queue.put(events.Event(events.Actions.EVAL, {'expression': expression, 'inspect': True}))
        result = self._result_queue.get()

        if result.name == events.Results.DATA and result.value['finish'] or result.name == events.Results.ERROR:
            self.stop()

        print(result.name, result.value, '\n\n')
        return [result]
