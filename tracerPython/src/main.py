import argparse
from google.protobuf import json_format, text_format
import json
import pathlib
from protobuf import tracer_pb2
import sys
import tracer


def main():
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.add_argument('--in-mode', default='proto', choices=['proto', 'text'], help='The input mode')
    parser.add_argument('--out-mode', default='proto', choices=['json', 'proto', 'text'], help='The output mode')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source, ignoring the provided')
    arguments = parser.parse_args()

    if arguments.in_mode == 'proto':
        trace = tracer_pb2.Trace()
        trace.ParseFromString(sys.stdin.buffer.read(int.from_bytes(sys.stdin.buffer.read(4), 'little')))
    else:
        trace_data = json.loads(input('trace => ["source", "input"?, steps?]:\n'))
        trace = tracer_pb2.Trace(
            source=pathlib.Path('./res/main.py').read_text(encoding='utf8') if arguments.test else
            trace_data[0] if len(trace_data) > 0 else
            '',
            input=trace_data[1] if len(trace_data) > 1 else '',
            steps=trace_data[2] if len(trace_data) > 2 else 2 ** 31 - 1
        )

    t = tracer.Tracer(trace)
    result = t.run()

    if arguments.out_mode == 'proto':
        serialized = result.SerializeToString()
        sys.stdout.buffer.write(len(serialized).to_bytes(4, 'little'))
        sys.stdout.buffer.write(serialized)
        sys.stdout.buffer.flush()
    elif arguments.out_mode == 'json':
        print(json_format.MessageToJson(result, including_default_value_fields=True), flush=True)
    else:
        print(text_format.MessageToString(result, as_utf8=True, as_one_line=False), flush=True)

if __name__ == '__main__':
    main()
