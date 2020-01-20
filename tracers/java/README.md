# Java Tracer

A tool to inspect java code.
This tool analyses the execution of a source at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, this result records is then returned.

The Makefile can be used to start the tracer command line interface. The arguments are passed in to the python script through the ARGS variable.

```shell
$ make build
javac -cp src/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED -d out/ src/Main.java
$ make run ARGS='--help'
java -cp out/:lib/* --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED Main --help
usage: tracer [options]
  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}

Java tracer CLI

named arguments:
  -h, --help             show this help message and exit
  --pretty               Pretty print output
  --test                 Run the test code

$ # use the --silent flag to disable echoing command recipes
$ make run --silent ARGS='--pretty --test'
$ # some java VMs emit 'picked options'. Use run-suppress-trash to filter them out
$ make run-suppress-trash ARGS='--pretty'
```

The program data to be traced must be provided through the tracer standard input stream. The tracer result is print to the standard output stream.

The input must be in the json format with the following properties:

```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program may get stop if enough input is provided.",
    "steps": "the maximum amount of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not counted."
}
```

## Docker

This tracer image does not require especial options to build or run. Attention must be payed when passing arguments to the docker container.

```shell
$ docker image build --tag willow-tracer-java -- ./

$ # docker ENTRYPOINT='make run' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty -- willow-tracer-java
$ docker container run --rm --interactive --tty -- willow-tracer-java --silent ARGS='--pretty'
```
