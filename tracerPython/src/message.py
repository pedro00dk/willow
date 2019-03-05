class Action:
    """
    List of available actions that can be sent to the tracer.
    """

    START = 'start'
    STOP = 'stop'
    INPUT = 'input'
    STEP = 'step'


class Result:
    """
    List of results of the tracer.
    """

    STARTED = 'started'
    ERROR = 'error'
    DATA = 'data'
    PRINT = 'print'
    PROMPT = 'prompt'
    LOCKED = 'locked'


class Message:
    """
    Stores message data.
    """

    def __init__(self, name: str, value=None):
        self.name = name
        self.value = value
