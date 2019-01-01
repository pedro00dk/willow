import argparse
import json

import broker
import message


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('--uncontrolled', default=False, action='store_true',
                        help='Run without stopping and print all results')
    parser.add_argument('--omit-help', default=False, action='store_true', help='Omit help messages')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()

    tracer_broker = broker.TracerBroker(arguments.name, arguments.script, arguments.sandbox)

    if arguments.uncontrolled:
        run_uncontrolled(tracer_broker, arguments.omit_help)
    else:
        run_controlled(tracer_broker, arguments.omit_help)


def run_uncontrolled(tracer_broker: broker.TracerBroker, omit_help: bool):
    if not omit_help:
        print('## Running in uncontrolled mode')
        print('## Output format: <event result>\\n<event value>')
        print()

    print_results(tracer_broker.start())
    while True:
        try:
            results = tracer_broker.step()
            print_results(results)
            if results[-1].name == message.Result.LOCKED:
                tracer_broker.input('')
        except:
            break


def run_controlled(tracer_broker: broker.TracerBroker, omit_help: bool):
    if not omit_help:
        print('## Running in controlled mode')
        print('## Output format: <event result>\\n<event value>')
        print('## actions:')
        print('## start -> start the tracer')
        print('## step -> run next step')
        print('## input <data> -> sends input to script')
        print('## stop -> stops the tracer and the application')
        print()

    while True:
        action_data = input('>>> ')
        split_index = action_data.find(' ')
        action = action_data[:split_index if split_index != -1 else None]
        value = action_data[split_index + 1: 0 if split_index == -1 else None]
        try:
            if action == 'start':
                print_results(tracer_broker.start())
            elif action == 'step':
                print_results(tracer_broker.step(1))
            elif action == 'input':
                tracer_broker.input(value)
            elif action == 'stop':
                tracer_broker.stop()
                break
            else:
                print('action not found')
        except Exception as e:
            print('exception:')
            print(e)


def print_results(results: list):
    for result in results:
        print(result.name)
        print(json.dumps(result.value))
        print()


if __name__ == '__main__':
    main()
