# Java Tracer

A tool to inspect java code, analyzing it line by line and returning its state (stack and heap data).


```
usage: tracer [-h] [--name NAME] [--test] [--uncontrolled] [--sandbox]
              [code]

Tracer CLI parser

positional arguments:
  code                   The python code to parse

named arguments:
  -h, --help             show this help message and exit
  --name NAME            The code name
  --test                 Run the test code, ignore any provided
  --uncontrolled         Run without stopping
  --sandbox              Run in a restricted scope
```