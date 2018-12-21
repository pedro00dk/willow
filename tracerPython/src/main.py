import argparse

import tracer


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('--name', default='<script>', help='The script name')
    parser.add_argument('--sandbox', default=False, action='store_true', help='Run in a restricted scope')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()

    tracer_stepper = tracer.TracerStepper(arguments.name, arguments.script, arguments.sandbox)
    print(tracer_stepper.start())
    while True:
        try:
            tracer_stepper.step()
        except:
            break


if __name__ == '__main__':
    main()
