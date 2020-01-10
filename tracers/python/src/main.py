import argparse
import json
import pathlib
import tracer


def main():
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.usage = 'tracer [options]\n  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}'
    parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source')
    options = parser.parse_args()

    raw_trace = json.loads(input())
    trace = {
        'source':
        raw_trace['source'] if not options.test and raw_trace.get('source') is not None else
        pathlib.Path('./res/main.py').read_text(encoding='utf8') if options.test else
        '',
        'input': raw_trace['input'] if raw_trace.get('input') is not None else '',
        'steps': raw_trace['steps'] if raw_trace.get('steps') is not None else 2 ** 31 - 1
    }

    result = tracer.Tracer(trace).run()

    print(
        json.dumps(
            result,
            check_circular=False,
            indent=4 if options.pretty else None,
            separators=None if options.pretty else (',', ':')
        ),
        end=''
    )


if __name__ == '__main__':
    main()
