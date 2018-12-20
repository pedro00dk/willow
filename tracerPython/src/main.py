import argparse

import tracer


def main():
    parser = argparse.ArgumentParser(description='Tracer CLI parser')
    parser.add_argument('script', help='The python script to parse')
    arguments = parser.parse_args()
    
    tracer.Tracer('<script>', arguments.script, True).start()



if __name__ == '__main__':
    main()
