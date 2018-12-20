import sys
import types

import scope
import inspector


class Tracer:
    """
    Trace python code and analyses its state after every instruction.
    """

    def __init__(self, name: str, script: str, sandbox: bool):
        """
        Initialize the tracer with the python script.

            :param name: script name
            :param script: python script
            :param sandbox: use sandbox scope instead of default scope
        """
        self._name = name
        self._script = script
        self._sandbox = sandbox
        self._lines = self._script.splitlines() if len(script) > 0 else ['']
        self._controller = inspector.Inspector(self._name, self._lines)

    def start(self):
        """
        Start to trace the script.
        """
        script_scope = scope.default_scope(self._name) if not self._sandbox else scope.sandbox_scope(self._name)
        try:
            sys.settrace(self._controller.trace)
            exec(compile(self._script, script_scope[scope.Globals.FILE], 'exec'), script_scope)
            print('done')
        except Exception as e:
            print('error')
            print(str(e))
        finally:
            sys.settrace(None)
