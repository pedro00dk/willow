class Actions:
    """
    List of available actions that can be sent to the tracer.
    """

    START = 'start'
    QUIT = 'quit'
    STEP = 'step'
    EVAL = 'eval'
    INPUT = 'input'


class Results:
    """
    List of results of the tracer.
    """

    STARTED = 'started'
    ERROR = 'error'
    DATA = 'data'
    PRODUCT = 'product'
    PRINT = 'print'
    PROMPT = 'prompt'
    LOCKED = 'locked'


class Event:
    """
    Stores event data.
    """

    def __init__(self, name: str, value=None):
        """
        Crates the event with its name and value.
        """
        self.name = name
        self.value = value
