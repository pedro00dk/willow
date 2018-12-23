import types


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
