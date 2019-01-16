import argparse
import json
import pathlib
import sys

import broker
import message


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('code', nargs='?', help='The python code to parse')
    parser.add_argument('--name', default='<code>', help='The code name')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test code, ignore any provided')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('--uncontrolled', default=False, action='store_true', help='Run without stopping')
    parser.add_argument('--omit-help', default=False, action='store_true', help='Omit help messages')
    parser.add_argument('--max-frames', type=int, help='Limit the number of frames')
    parser.add_argument('--max-stacks', type=int, help='Limit the number of stacks')
    parser.add_argument('--max-objects', type=int, help='Limit the number of complex objects in heap')
    parser.add_argument('--max-properties', type=int, help='Limit user defined objects properties count')
    parser.add_argument('--max-iterables', type=int, help='Limit tuples, lists, sets and dicts length')
    parser.add_argument('--max-strings', type=int, help='Limit strings length')

    arguments = parser.parse_args()

    code = pathlib.Path('./res/main.py').read_text(encoding='utf8') if arguments.test else None
    code = arguments.code if not arguments.test else code

    if code is None:
        print('No code or test flag provided. check --help', file=sys.stderr)
        return 1

    tracer_broker = broker.TracerBroker(arguments.name, code, arguments.sandbox)
    if arguments.uncontrolled:
        run_uncontrolled(tracer_broker, arguments.omit_help)
    else:
        run_controlled(tracer_broker, arguments.omit_help)


def run_uncontrolled(tracer_broker: broker.TracerBroker, omit_help: bool):
    if not omit_help:
        print('uncontrolled mode')
        print()

    print_results(tracer_broker.start())
    while True:
        results = tracer_broker.step()
        print_results(results)

        if results[-1].name == message.Result.LOCKED:
            tracer_broker.input('')

        if not tracer_broker.is_tracer_running():
            break


def run_controlled(tracer_broker: broker.TracerBroker, omit_help: bool):
    if not omit_help:
        print('controlled mode')
        print('start -> start the tracer')
        print('step -> run next step')
        print('input <string> -> sends input to the code')
        print('stop -> stops the tracer')
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
                results = tracer_broker.step()
                print_results(results)
            elif action == 'input':
                tracer_broker.input(value)
            elif action == 'stop':
                try:
                    tracer_broker.stop()
                except:
                    pass
            else:
                raise Exception('action not found')

            if not tracer_broker.is_tracer_running():
                break

        except Exception as e:
            print(json.dumps(f'exception: {e}'))


def print_results(results: list):
    print(json.dumps([r.__dict__ for r in results]))


if __name__ == '__main__':
    main()
