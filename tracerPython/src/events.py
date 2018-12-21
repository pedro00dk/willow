class Actions:
    """
    List of available actions that can be sent to the tracer.
    """

    START = 'start'
    QUIT = 'quit'
    STEP = 'step'


class Results:
    """
    List of results of the tracer
    """

    STARTED = 'started'
    ERROR = 'error'
    DATA = 'data'


class Event:
    """
    Store event data.
    """

    def __init__(self, name: str, value=None):
        """
        Crate the event with its name and value.

            :param name: event name
            :param value: event value
        """
        self.name = name
        self.value = value
