import argparse
import json
import pathlib
import sys
import tracer


def main():
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.usage = 'tracer [options]\ninput pipe: {"source?": "string", "input"?: "string", "steps?": "number"}'
    parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source, ignoring the provided')
    arguments = parser.parse_args()

    trace = json.loads(input())

    trace['source'] = \
        trace['source'] if not arguments.test and trace.get('source') is not None else \
        pathlib.Path('./res/main.py').read_text(encoding='utf8') if arguments.test else \
        ''
    trace['input'] = trace['input'] if trace.get('input') is not None else ''
    trace['steps'] = trace['steps'] if trace.get('steps') is not None else 2 ** 31 - 1

    t = tracer.Tracer(trace)
    result = t.run()

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
