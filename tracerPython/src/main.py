import argparse
import pprint

import broker
import message


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('--formatted', default=False, action='store_true', help='Print formatted results')
    parser.add_argument('--uncontrolled', default=False, action='store_true',
                        help='Run without stopping and print all results')
    parser.add_argument('--omit-help', default=False, action='store_true', help='Omit help messages')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()

    trace_broker = broker.TracerBroker(arguments.name, arguments.script, arguments.sandbox)

    if arguments.uncontrolled:
        run_uncontrolled(trace_broker, arguments.formatted, arguments.omit_help)
    else:
        run_controlled(trace_broker, arguments.formatted, arguments.omit_help)


def run_uncontrolled(trace_broker: broker.TracerBroker, formatted: bool, omit_help: bool):
    if not omit_help:
        print('## Running in uncontrolled mode')
        print('## Output format: <event result>\\n<event value>')
        print()

    print_results(trace_broker.start(), formatted)
    while True:
        try:
            results = trace_broker.step()
            print_results(results, formatted)
            if results[-1].name == message.Results.LOCKED:
                trace_broker.input('')
        except:
            break


def run_controlled(trace_broker: broker.TracerBroker, formatted: bool, omit_help: bool):
    if not omit_help:
        print('## Running in controlled mode')
        print('## Output format: <event result>\\n<event value>')
        print('## actions:')
        print('## start -> start the tracer')
        print('## step -> run next step')
        print('## eval <expr> -> evaluates an expression (expr shall not have spaces)')
        print('## input <data> -> sends input to script')
        print('## stop -> stops the tracer and the application')
        print()

    while True:
        action_data = input('>>> ').split()
        action = action_data[0]
        value = ' '.join(action_data[1:])
        try:
            if action == 'start':
                print_results(trace_broker.start(), formatted)
            elif action == 'step':
                print_results(trace_broker.step(1), formatted)
            elif action == 'eval':
                print_results(trace_broker.eval(value), formatted)
            elif action == 'input':
                trace_broker.input(value)
            elif action == 'stop':
                trace_broker.stop()
                break
            else:
                print('action not found')
        except Exception as e:
            print('exception:')
            print(e)


def print_results(results: list, formatted: bool):
    print_function = print if not formatted else pprint.pprint
    for result in results:
        print(result.name)
        if formatted:
            pprint.pprint(result.value)
        else:
            print(result.value)
        print()


if __name__ == '__main__':
    main()
