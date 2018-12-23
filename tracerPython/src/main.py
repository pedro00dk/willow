import argparse
import pprint

import broker


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('--formated', default=False, action='store_true', help='Print formated results')
    parser.add_argument('--uncontrolled', default=False, action='store_true',
                        help='Run without stopping and print all results')
    parser.add_argument('--omit-help', default=False, action='store_true', help='Omit help messages')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()

    trace_broker = broker.TracerBroker(arguments.name, arguments.script, arguments.sandbox)
    if arguments.uncontrolled:
        run_uncontrolled(trace_broker, arguments.omit_help)
    else:
        run_controlled(trace_broker, arguments.omit_help)
        pass


def run_uncontrolled(trace_broker: broker.TracerBroker, omit_help: bool):
    if not omit_help:
        print('## Running in uncontrolled mode')
        print('## Output format: <event result>\\n<event value>')

    print_results(trace_broker.start())
    try:
        while True:
            print_results(trace_broker.step())

    except:
        pass


def run_controlled(trace_broker: broker.TracerBroker, omit_help: bool):
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
        action_data = input('>').split()
        try:
            if action_data[0] == 'start':
                print_results(trace_broker.start())
            elif action_data[0] == 'step':
                print_results(trace_broker.step(1))
            elif action_data[0] == 'eval':
                print_results(trace_broker.eval(action_data[1]))
            elif action_data[0] == 'input':
                trace_broker.input(action_data[1])
            elif action_data[0] == 'stop':
                trace_broker.stop()
                break
            else:
                print('action not found, try again!')
        except Exception as e:
            # raise e
            print(e)
            print('continuing')


def print_results(results: list):
    for result in results:
        print(result.name)
        pprint.pprint(result.value)
        print()


if __name__ == '__main__':
    main()
