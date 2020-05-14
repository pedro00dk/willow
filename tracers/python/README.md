# Python Tracer

A tool to inspect python code.
This tool analyses the execution of a script at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, the record is then returned.

The Makefile can be used to start the tracer command line interface.
The arguments are passed in to the python script through the ARGS variable.

## Execution Modes

This tool provides three way to execute, they are:

### Server

```shell
$ make setup
$ . .venv/bin/activate
$ make server
SERVER=true python ./main.py
 * Serving Flask app "Python tracer Server" (lazy loading)
 * Environment: production
   WARNING: This is a development server. Do not use it in a production deployment.
   Use a production WSGI server instead.
 * Debug mode: off
 * Running on http://0.0.0.0:8000/ (Press CTRL+C to quit)

```

The request must be provided through POST requests.

### Cloud Function

Before running the deploy command, you must login to your gcp account and configure project and function region.
You can also change the make command to set these properties.

```shell
$ make deploy
gcloud functions deploy cloud_python_tracer --runtime python37 --trigger-http --allow-unauthenticated
Deploying function (may take a while - up to 2 minutes)...done.
availableMemoryMb: 256
entryPoint: cloud_python_tracer
httpsTrigger:
  url: <function-url>
ingressSettings: ALLOW_ALL
labels:
  deployment-tool: cli-gcloud
name: <function-name>
runtime: python37
serviceAccountEmail: <service-account>
sourceUploadUrl: <upload-url>
status: ACTIVE
timeout: 60s
updateTime: <date>
versionId: '20'
```

The request must be provided through POST requests.

### Terminal

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

The request must be provided through the tracer standard input stream.

## Request Format

The request must be in the json format with the following properties:

```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided.",
    "steps": "the maximum number of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not counted."
}
```

## Docker

This application can also run from a container in server or terminal execution modes

```shell
$ docker image build --tag <image-name> -- ./

$ # docker CMD='make terminal'
$ # ex:
$ docker container run --rm --interactive --tty -- <image-name> # CMD is implicit, for terminal mode
$ docker container run --rm --interactive --tty -- willow-tracer-python make server # for server mode
```
