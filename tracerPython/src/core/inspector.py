import multiprocessing as mp
import sys
import traceback
import types

import events


class Inspector:
    """
    Control the script tracing progression by receiving commands.
    """

    TRACEABLE_EVENTS = {'call', 'line', 'exception', 'return'}

    def __init__(self, name: str, lines: list, action_queue: mp.Queue, result_queue: mp.Queue):
        """
        Initialize the tracer controller with the script name and lines.

            :param name: script name
            :param line: script lines
            :param action_queue: queue to read actions
            :param result_queue: queue to write results
        """
        self._name = name
        self._lines = lines
        self._action_queue = action_queue
        self._result_queue = result_queue

        # inspection properties
        self.exec_call_frame = None
        self.inspected_frame_count = 0

    def is_script_file(self, frame: types.FrameType):
        """
        Check if the frame is from the main script file.

            :return: frame is from script file
        """
        return frame.f_code.co_filename == self._name

    def is_traceable_event(self, event: str):
        """
        Check if the frame event is traceable.

            :return: if is traceable
        """
        return event in Inspector.TRACEABLE_EVENTS

    def trace(self, frame: types.FrameType, event: str, args):
        """
        The script trace function.

            :param frame: current frame stack
            :param event: current code event, one of: 'call', 'line', 'return', 'exception' or 'opcode'
            :param args: context arguments in some code states
        """
        if not self.is_script_file(frame) or not self.is_traceable_event(event):
            return self.trace

        self.exec_call_frame = frame.f_back if self.inspected_frame_count == 0 else self.exec_call_frame
        self.inspected_frame_count += 1

        while True:
            action = self._action_queue.get()

            # hold actions
            if action.name == events.Actions.EVAL:
                expression = action.value['expression']
                inspect = action.value['inspect']

                # evaluate first and then inspect state
                product = self.evaluate_expression(frame, expression)
                inspection = self.inspect_state(frame, event, args) if inspect else {}

                self._result_queue.put(events.Event(events.Results.PRODUCT, {**inspection, **product}))
                continue

            # progressive actions
            if action.name == events.Actions.STEP:
                self._result_queue.put(events.Event(events.Results.DATA, self.inspect_state(frame, event, args)))
            elif action.name == events.Actions.QUIT:
                self._result_queue.put(events.Event(events.Results.DATA, {}))
            break

        return self.trace

    # evaluation methods

    def evaluate_expression(self, frame: types.FrameType, expression: str):
        """
        Evaluate expressions against the frame scope, process the exception if any is thrown.
        The expression is able to mutate the script state.

            :params ref(trace):
            :param expression: expression to evaluate
            :return: expression result
        """
        try:
            product = eval(expression, frame.f_globals, frame.f_locals)
        except Exception as e:
            product = {
                'type': type(e).__name__,
                'value': e.args,
                'traceback': traceback.format_exception(type(e), e, e.__traceback__)
            }
            pass
        finally:
            return {'product': product}

    # inspection methods

    def inspect_state(self, frame: types.FrameType, event: str, args):
        """
        Inspect the application state.
        Analyse the stack and heap, collecting the objects.

            :params ref(trace):
            :return: dict with trace information
        """
        stack_frames, stack_lines = self.inspect_stack(frame)
        stack_references, heap_graph, user_classes = self.inspect_heap(stack_frames)
        finish = event == 'return' and len(stack_frames) == 1
        return {
            'event': event,
            'line': stack_lines[0]['line'],
            'text': stack_lines[0]['text'],
            'stack_lines': stack_lines,
            'stack_references': stack_references,
            'heap_graph': heap_graph,
            'user_classes': user_classes,
            'finish': finish
        }

    def inspect_stack(self, frame: types.FrameType):
        """
        Inspect the application stack.

            :params ref(trace):
            :return: stack frames of script only
            :return: dict with frames names, lines and text
        """
        current_frame = frame
        frames = []
        while current_frame != self.exec_call_frame:
            frames.append(current_frame)
            current_frame = current_frame.f_back

        frames = [frame for frame in frames if self.is_script_file(frame)]
        lines = [
            {'name': frame.f_code.co_name, 'line': frame.f_lineno - 1, 'text': self._lines[frame.f_lineno - 1]}
            for frame in frames
        ]
        return frames, lines

    def inspect_heap(self, stack_frames: list):
        """
        Inspect the application heap.
        Inspect every object found from the stack frames

            :param stack_frames: list of stack frames
            :return: stack references
            :return: heap graph with references as keys
            :return: user defined/manipulated classes (the tracer does not support safe type manipulation)
        """
        stack_references = []
        heap_graph = {}
        user_classes = set()

        for frame in stack_frames[::-1]:
            frame_variables = frame.f_locals
            frame_references = [
                (name, self.inspect_object(frame_variables[name], heap_graph, user_classes))
                for name, value in frame_variables.items() if not name.startswith('_')
            ]
            stack_references.append(frame_references)

        return stack_references, heap_graph, user_classes

    def inspect_object(self, obj, heap_graph: dict, user_classes: set):
        """
        Inspect the received object.
        If the object is a const (bool, int, float, None, complex, str), returns its value.
        If the object is a type (type), returns its type name.
        Otherwise, returns the object reference (list with a single number inside)
        recursively, inspecting object members and filling the heap_graph and user_classes



            :param obj: object to inspect
            :param heap_graph: dict with existent objects references (mutable)
            :param user_classes: list of found manipulated classes (mutable)
            :return: object value if const or type, or object reference
        """
        # const type
        if isinstance(obj, (bool, int, float, type(None))):
            return obj
        if isinstance(obj, (complex, str)):
            return repr(obj)

        # type type
        if isinstance(obj, type):
            if obj not in {list, tuple, set, dict}:
                user_classes.add(obj)
            return type(obj).__name__

        # iterable object type
        reference = id(obj)

        if reference not in heap_graph:

            if isinstance(obj, (list, tuple, set)):
                members = enumerate(obj)
            elif isinstance(obj, dict):
                members = obj.items()
            else:
                members = ((name, value) for name, value in vars(obj).items() if not name.startswith('_'))

            # add reference to heap graph (has to be added before other objects inspections)
            heap_graph[reference] = {}

            members_inspections = [
                (self.inspect_object(name, heap_graph, user_classes), self.inspect_object(value, heap_graph, user_classes))
                for name, value in members
            ]

            # update with all data
            heap_graph[reference] = {'type': type(obj).__name__, 'members': members_inspections}

        return reference,
