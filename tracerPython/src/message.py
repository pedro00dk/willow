class Action:
    START = 0
    STOP = 1
    STEP = 2
    INPUT = 3


class Event:
    STARTED = 0
    INSPECTED = 1
    PRINTED = 2
    LOCKED = 3
    THREW = 4


class Message:

    def __init__(self, name: str, value=None):
        self.name = name
        self.value = value
