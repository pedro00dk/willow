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
