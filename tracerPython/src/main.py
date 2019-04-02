import argparse
import client
from google.protobuf import json_format, text_format
import json
import message
import pathlib
from protobuf import event_pb2, tracer_pb2
import sys


def main():
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.add_argument('--auto', default=False, action='store_true', help='Run without stopping')
    parser.add_argument('--in-mode', default='proto', choices=['proto', 'text'], help='The input mode')
    parser.add_argument('--out-mode', default='proto',
                        choices=['json', 'proto', 'text', 'text1'], help='The output mode')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test code ignoring the provided')
    arguments = parser.parse_args()
    run(arguments.auto, arguments.in_mode, arguments.out_mode, arguments.test)


def run(auto: bool, in_mode: str, out_mode: str, test: bool):
    tracer = client.Client()

    if in_mode == 'proto':
        request = read_input(in_mode)
        if not request.actions[0].HasField('start'):
            raise Exception('unexpected action')
        main = request.actions[0].start.main
        code = request.actions[0].start.code
    else:
        start_data = json.loads(read_input(in_mode, 'start {json(["main", "code"])}:\n'))
        main = start_data[0]
        code = start_data[1]

    if test:
        main = '<script>'
        code = pathlib.Path('./res/main.py').read_text(encoding='utf8')

    events = tracer.start(main, code)
    write_output(out_mode, events)

    while True:
        if not tracer.is_tracer_running():
            break

        if auto:
            events = tracer.step()
            write_output(out_mode, events)
            if events[-1].name == message.Event.LOCKED:
                tracer.input(['input'])
        else:
            if in_mode == 'proto':
                request = read_input(in_mode)
                action = request.actions[0].WhichOneof('action')
                value = [*request.actions[0].input.lines] if action == 'input' else ''
            else:
                action_data = read_input(in_mode, 'action {"stop", "step", "input" json(["line"*])}:\n')
                split_index = action_data.find(' ')
                action = action_data[:split_index if split_index != -1 else None]
                value = action_data[split_index + 1: 0 if split_index == -1 else None]

            if action == 'stop':
                try:
                    tracer.stop()
                except Exception:
                    pass
            elif action == 'step':
                events = tracer.step()
                write_output(out_mode, events)
            elif action == 'input':
                tracer.input(value if isinstance(value, list) else json.loads(value) if len(value) > 0 else [])
            else:
                raise Exception('unexpected action')


def read_input(mode: str, prompt: str = ''):
    if mode == 'proto':
        request = tracer_pb2.TracerRequest()
        request.ParseFromString(sys.stdin.buffer.read(int.from_bytes(sys.stdin.buffer.read(4), 'little')))
        return request
    elif mode == 'text':
        return input(prompt)
    else:
        raise Exception('unexpected input mode')


def write_output(mode: str, event_messages: list):
    response = event_messages_to_response_protocol(event_messages)
    if mode == 'json':
        print(json_format.MessageToJson(response, including_default_value_fields=True), flush=True)
    elif mode == 'proto':
        serialized_message = response.SerializeToString()
        sys.stdout.buffer.write(len(serialized_message).to_bytes(4, 'little'))
        sys.stdout.buffer.write(serialized_message)
        sys.stdout.buffer.flush()
    elif mode == 'text':
        print(text_format.MessageToString(response, as_utf8=True, as_one_line=False), flush=True)
    elif mode == 'text1':
        print(text_format.MessageToString(response, as_utf8=True, as_one_line=True), flush=True)
    else:
        raise Exception('unexpected output mode')


def event_messages_to_response_protocol(event_messages: list):
    response = tracer_pb2.TracerResponse()
    response.events.extend([event_message_to_event_protocol(event_message) for event_message in event_messages])
    return response


def event_message_to_event_protocol(event_message: message.Message):
    event = event_pb2.Event()
    if event_message.name == message.Event.STARTED:
        event.started.SetInParent()
    elif event_message.name == message.Event.INSPECTED:
        event.inspected.frame.type = event_pb2.Frame.Type.Value(event_message.value['type'].upper())
        event.inspected.frame.line = event_message.value['stack'][0]['line']
        event.inspected.frame.finish = event_message.value['finish']
        if event_message.value['exception'] is not None:
            event.inspected.frame.exception.type = event_message.value['exception']['type']
            event.inspected.frame.exception.args[:] = event_message.value['exception']['args']
            event.inspected.frame.exception.traceback[:] = event_message.value['exception']['traceback']
        event.inspected.frame.stack.scopes.extend([
            event_pb2.Frame.Stack.Scope(
                line=scope['line'],
                name=scope['name'],
                variables=[
                    event_pb2.Frame.Stack.Scope.Variable(
                        name=name,
                        value=event_pb2.Frame.Value(booleanValue=value) if isinstance(value, bool) else
                        # protobuf does not support arbitrary precision integer like python does
                        # using string for numbers > 2**64
                        event_pb2.Frame.Value(integerValue=value)
                            if isinstance(value, int) and abs(value) < 9223372036854775808 else
                        event_pb2.Frame.Value(stringValue=str(value)) if isinstance(value, int) else
                        event_pb2.Frame.Value(floatValue=value) if isinstance(value, float) else
                        event_pb2.Frame.Value(stringValue=value) if isinstance(value, str) else
                        event_pb2.Frame.Value(reference=value[0])
                    )
                    for name, value in scope['variables']
                ]
            )
            for scope in event_message.value['stack']
        ])
        event.inspected.frame.heap.references.clear()
        [
            event.inspected.frame.heap.references[reference].CopyFrom(event_pb2.Frame.Heap.Obj(
                type=event_pb2.Frame.Heap.Obj.Type.Value(
                    'TUPLE' if obj['type'] == 'tuple' else
                    'ALIST' if obj['type'] == 'list' else
                    'SET' if obj['type'] == 'set' else
                    'HMAP' if obj['type'] == 'map' else
                    'OTHER'
                ),
                lType=obj['lType'],
                userDefined=obj['userDefined'],
                members=[
                    event_pb2.Frame.Heap.Obj.Member(
                        key=event_pb2.Frame.Value(booleanValue=key) if isinstance(key, bool) else
                        event_pb2.Frame.Value(integerValue=key) if isinstance(key, int) else
                        event_pb2.Frame.Value(floatValue=key) if isinstance(key, float) else
                        event_pb2.Frame.Value(stringValue=key) if isinstance(key, str) else
                        event_pb2.Frame.Value(reference=key[0]),
                        value=event_pb2.Frame.Value(booleanValue=value) if isinstance(value, bool) else
                        event_pb2.Frame.Value(integerValue=value) if isinstance(value, int) else
                        event_pb2.Frame.Value(floatValue=value) if isinstance(value, float) else
                        event_pb2.Frame.Value(stringValue=value) if isinstance(value, str) else
                        event_pb2.Frame.Value(reference=value[0])
                    )
                    for key, value in obj['members']
                ]
            ))
            for reference, obj in event_message.value['heap'].items()
        ]
    elif event_message.name == message.Event.PRINTED:
        event.printed.value = event_message.value
    elif event_message.name == message.Event.LOCKED:
        event.locked.cause = event_message.value
    elif event_message.name == message.Event.THREW:
        event.threw.exception.type = event_message.value['type']
        event.threw.exception.args[:] = event_message.value['args']
        event.threw.exception.traceback[:] = event_message.value['traceback']
    else:
        raise Exception('unexpected message name')
    return event


if __name__ == '__main__':
    main()
