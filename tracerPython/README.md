# Python Tracer

A tool to inspect python scripts, analyzing it line by line and returning its state (stack and heap data).

```
usage: main.py [-h] [--name NAME] [--sandbox] [--uncontrolled] [--omit-help]
               script

Tracer CLI parser

positional arguments:
  script          The python script to parse

optional arguments:
  -h, --help      show this help message and exit
  --name NAME     The script name
  --sandbox       Run in a restricted scope
  --uncontrolled  Run without stopping and print all results
  --omit-help     Omit help messages
```
