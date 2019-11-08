# Python Tracer

A tool to inspect python code, analyzing it line by line and returning its state (stack and heap data).

```
usage: tracer [options]
  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}

Python tracer CLI

optional arguments:
  -h, --help  show this help message and exit
  --pretty    Pretty print output
  --test      Run the test source, ignoring the provided
```

The tracer receives the input through standard input stream and its result will be generated in the standard output stream.
The input must be in the json format with the following properties:
```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program may get stuck (finishing the tracing process) if not enough input is provided.",
    "steps": "a number that limits the maximum amount of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not count."
}
```

The output follows the JSON-Schema found in the schemas folder in this project.