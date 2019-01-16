# Python Tracer

A tool to inspect python code, analyzing it line by line and returning its state (stack and heap data).

```
usage: main.py [-h] [--name NAME] [--test] [--uncontrolled] [--omit-help]
               [--max-frames MAX_FRAMES] [--max-stacks MAX_STACKS]
               [--max-objects MAX_OBJECTS] [--max-properties MAX_PROPERTIES]
               [--max-iterables MAX_ITERABLES] [--max-strings MAX_STRINGS]
               [--sandbox]
               [code]

Tracer CLI parser

positional arguments:
  code                  The python code to parse

optional arguments:
  -h, --help            show this help message and exit
  --name NAME           The code name
  --test                Run the test code, ignore any provided
  --uncontrolled        Run without stopping
  --omit-help           Omit help messages
  --max-frames MAX_FRAMES
                        Limit the number of frames
  --max-stacks MAX_STACKS
                        Limit the number of stacks
  --max-objects MAX_OBJECTS
                        Limit the number of complex objects in heap
  --max-properties MAX_PROPERTIES
                        Limit user defined objects properties count
  --max-iterables MAX_ITERABLES
                        Limit tuples, lists, sets and dicts length
  --max-strings MAX_STRINGS
                        Limit strings length
  --sandbox             Run in a restricted scope
```
