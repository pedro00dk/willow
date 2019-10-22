import argparse
import json
import pathlib
import tracer


def main():
    argument_parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    argument_parser.usage = 'tracer [options]\n  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}'
    argument_parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    argument_parser.add_argument(
        '--test',
        default=False,
        action='store_true',
        help='Run the test source, ignoring the provided'
    )
    arguments = argument_parser.parse_args()

    trace_data = json.loads(input())
    source = \
        trace_data['source'] if not arguments.test and trace_data.get('source') is not None else \
        pathlib.Path('./res/main.py').read_text(encoding='utf8') if arguments.test else \
        ''
    input_ = trace_data['input'] if trace_data.get('input') is not None else ''
    steps = trace_data['steps'] if trace_data.get('steps') is not None else 2 ** 31 - 1

    result = tracer.Tracer(source, input_, steps).run()

    print(
        json.dumps(
            result,
            check_circular=False,
            indent=4 if arguments.pretty else None,
            separators=None if arguments.pretty else (',', ':')
        ),
        end=''
    )


if __name__ == '__main__':
    main()
