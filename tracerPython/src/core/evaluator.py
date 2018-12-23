import types

from .util import FrameUtil, ExceptionUtil


class Evaluator:
    """
    Evaluates an expression in a frame scope.
    """

    @classmethod
    def evaluate(cls, frame: types.FrameType, expression: str):
        """
        Evaluates expressions against the frame scope, process possible exceptions if any is thrown.
        The expression is able to mutate the script state.
        """
        try:
            product = eval(expression, FrameUtil.globals(frame), FrameUtil.locals(frame))
        except Exception as e:
            product = ExceptionUtil.dump(e)

        return {
            'product': product
        }
