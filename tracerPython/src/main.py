import argparse

import broker


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()

    tracer_stepper = broker.TracerBroker(arguments.name, arguments.script, arguments.sandbox)
    tracer_stepper.start()
    i = 0
    while True:
        i += 1
        try:
            tracer_stepper.step()
            if i % 10 == 0:
                tracer_stepper.eval('a.update({\'i\': a[\'i\'] + 3})')
        except:
            break


if __name__ == '__main__':
    main()
