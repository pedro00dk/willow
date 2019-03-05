class Action:
    CREATE = 0
    START = 1
    STOP = 2
    STEP = 3
    INPUT = 4


class Event:
    CREATED = 0
    STARTED = 1
    INSPECTED = 2
    PRINTED = 3
    LOCKED = 4
    THREW = 5


class Message:

    def __init__(self, name: str, value=None):
        self.name = name
        self.value = value
