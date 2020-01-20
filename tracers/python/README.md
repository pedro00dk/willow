# Python Tracer

A tool to inspect python code.
This tool analyses the execution of a script at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, this result records is then returned.

The Makefile can be used to start the tracer command line interface. The arguments are passed in to the python script through the ARGS variable.

```shell
$ make run ARGS='--help'
python ./src/main.py --help
usage: tracer [options]
  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}

Python tracer CLI

optional arguments:
  -h, --help  show this help message and exit
  --pretty    Pretty print output
  --test      Run the test source

$ # use the --silent flag to disable echoing command recipes
$ make run --silent ARGS='--pretty --test'
```

The program data to be traced must be provided through the tracer standard input stream. The tracer result is print to the standard output stream.

The input must be in the json format with the following properties:

```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided.",
    "steps": "the maximum number of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not counted."
}
```
