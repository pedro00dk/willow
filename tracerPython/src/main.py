import argparse
import json
import pathlib
import sys

import broker
import message


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser', usage=argparse.SUPPRESS)
    parser.add_argument('code', nargs='?', help='The python code to parse')
    parser.add_argument('--name', default='<code>', help='The code name')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test code, ignore any provided')
    parser.add_argument('--uncontrolled', default=False, action='store_true', help='Run without stopping')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')

    arguments = parser.parse_args()

    code = pathlib.Path('./res/main.py').read_text(encoding='utf8') if arguments.test else None
    code = arguments.code if not arguments.test else code

    if code is None:
        print_error('No code or test flag provided. check --help')
        return 1

    tracer_broker = broker.TracerBroker(arguments.name, code, arguments.sandbox)
    print_results([])
    if arguments.uncontrolled:
        run_uncontrolled(tracer_broker)
    else:
        run_controlled(tracer_broker)


def run_uncontrolled(tracer_broker: broker.TracerBroker):
    print_results(tracer_broker.start())

    if not tracer_broker.is_tracer_running():
        return

    while True:
        results = tracer_broker.step()
        print_results(results)

        if results[-1].name == message.Result.LOCKED:
            tracer_broker.input('')

        if not tracer_broker.is_tracer_running():
            break


def run_controlled(tracer_broker: broker.TracerBroker):
    while True:
        action_data = input()
        split_index = action_data.find(' ')
        action = action_data[:split_index if split_index != -1 else None]
        value = action_data[split_index + 1: 0 if split_index == -1 else None]
        try:
            if action == message.Action.START:
                print_results(tracer_broker.start())
            elif action == message.Action.STOP:
                try:
                    tracer_broker.stop()
                except Exception:
                    pass
            elif action == message.Action.INPUT:
                tracer_broker.input(value)
            elif action == message.Action.STEP:
                results = tracer_broker.step()
                print_results(results)
            else:
                raise Exception('action not found')
            if not tracer_broker.is_tracer_running():
                break
        except Exception as e:
            print_error(str(e))


def print_results(results: list):
    print(json.dumps([r.__dict__ for r in results]))


def print_error(error: str):
    print(f'error: {error}', file=sys.stderr)


if __name__ == '__main__':
    main()
