from core import tracer
import message
import multiprocessing as mp


class Client:
    """
    Provides an easy interface for communication with the Tracer as it has to run in another process.
    """

    def __init__(self):
        self._manager = None
        self._action_queue = None
        self._event_queue = None
        self._tracer_process = None

    def is_tracer_running(self):
        return self._tracer_process is not None

    def start(self, main: str, code: str):
        if self.is_tracer_running():
            raise AssertionError('tracer running')

        self._manager = mp.Manager()
        self._action_queue = self._manager.Queue()
        self._event_queue = self._manager.Queue()
        self._tracer_process = mp.Process(target=tracer.Tracer.init_run, args=(self._action_queue, self._event_queue))
        self._tracer_process.start()

        self._action_queue.put(message.Message(message.Action.START, {'main': main, 'code': code}))
        event = self._event_queue.get()

        if event.name == message.Event.THREW:
            self.stop()

        return [event]

    def stop(self):
        if not self.is_tracer_running():
            raise AssertionError('tracer stopped')

        self._action_queue.put(message.Message(message.Action.STOP))
        self._tracer_process.terminate()
        self._tracer_process.join()
        self._tracer_process = None
        self._manager = None
        self._action_queue = None
        self._event_queue = None

    def step(self):
        if not self.is_tracer_running():
            raise AssertionError('tracer stopped')

        self._action_queue.put(message.Message(message.Action.STEP))
        events = []
        while True:
            event = self._event_queue.get()
            events.append(event)
            if event.name in {message.Event.INSPECTED, message.Event.THREW, message.Event.LOCKED}:
                break

        if event.name == message.Event.INSPECTED and event.value['finish'] or event.name == message.Event.THREW:
            self.stop()

        return events

    def input(self, lines: list):
        if not self.is_tracer_running():
            raise AssertionError('tracer stopped')
        if lines is None:
            raise AttributeError('lines is None')

        self._action_queue.put(message.Message(message.Action.INPUT, lines))
