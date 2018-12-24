import types
import traceback


class FrameUtil:
    """
    Utility objects and functions for processing frames.
    """

    # list of traceable events
    TRACEABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    @classmethod
    def file(cls, frame: types.FrameType):
        """
        Returns the file of the frame.
        """
        return frame.f_code.co_filename

    @classmethod
    def name(cls, frame: types.FrameType):
        """
        Returns the scope name of the frame.
        """
        return frame.f_code.co_name

    @classmethod
    def module(cls, frame: types.FrameType):
        """
        Returns the module of the frame.
        """
        return cls.globals(frame)['__name__']

    @classmethod
    def line(cls, frame: types.FrameType):
        """
        Returns the code line of the frame.
        """
        return frame.f_lineno - 1

    @classmethod
    def globals(cls, frame: types.FrameType):
        """
        Returns the global variables of the frame.
        """
        return frame.f_globals

    @classmethod
    def locals(cls, frame: types.FrameType):
        """
        Returns the local variables of the frame.
        """
        return frame.f_locals

    @classmethod
    def previous(cls, frame: types.FrameType):
        """
        Returns the previous frame in the stack.
        """
        return frame.f_back

    @classmethod
    def is_file(cls, frame: types.FrameType, name: str):
        """
        Returns true if the frame is from the received file name.
        """
        return cls.file(frame) == name

    @classmethod
    def is_traceable(cls, event: str):
        """
        Returns true if the frame event is traceable.
        """
        return event in cls.TRACEABLE_EVENTS


class ExceptionUtil:
    """
    Processes exceptions objects.
    """

    def dump(exception: Exception, with_traceback: types.TracebackType = None):
        """
        Raised exception cannot be pickled because of their traceback objects.
        This method transforms the exception in a dict with all data.
        """
        return {
            'type': type(exception).__name__,
            'args': exception.args,
            'traceback': traceback.format_exception(
                type(exception),
                exception,
                exception.__traceback__ if not with_traceback else with_traceback
            )
        }
