class EventFields:
    """
    Event fields.
    """
    TYPE = 'type'
    VALUE = 'value'


def new(type: str, value=None):
    """
    Create a new event.

        :param type: event type
        :param value: event value

        :return: event dict
    """
    return {EventFields.TYPE: type, EventFields.VALUE: value}
