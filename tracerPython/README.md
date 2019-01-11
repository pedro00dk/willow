# Python Tracer

A tool to inspect python code, analyzing it line by line and returning its state (stack and heap data).

```
usage: main.py [-h] [--name NAME] [--omit-help] [--sandbox] [--uncontrolled]
               [--test]
               [code]

Tracer CLI parser

positional arguments:
  code            The python code to parse

optional arguments:
  -h, --help      show this help message and exit
  --name NAME     The code name
  --omit-help     Omit help messages
  --sandbox       Run in a restricted scope
  --uncontrolled  Run without stopping and print all results
  --test          Ignores a possibly provided code and runs the test code
```
