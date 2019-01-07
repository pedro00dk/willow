import argparse
import json
import pathlib

import broker
import message


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--omit-help', default=False, action='store_true', help='Omit help messages')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('--uncontrolled', default=False, action='store_true',
                        help='Run without stopping and print all results')
    parser.add_argument('script', nargs='?', help='The python script to parse')

    arguments = parser.parse_args()
    script = arguments.script if arguments.script != None else pathlib.Path('./res/main.py').read_text(encoding='utf8')
    tracer_broker = broker.TracerBroker(arguments.name, script, arguments.sandbox)
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
        action_data = input('>>>\n')
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
                try:
                    tracer_broker.stop()
                except:
                    pass
                break
            else:
                raise Exception('action not found')
        except Exception as e:
            print(json.dumps(f'exception: {e}'))


def print_results(results: list):
    [print(json.dumps({'result': r.name, 'value': r.value})) for r in results]


if __name__ == '__main__':
    main()
