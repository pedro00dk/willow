# Java Tracer

A tool to inspect java code.
This tool analyses the execution of a source at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, the record is then returned.

The Makefile can be used to start the tracer command line interface.
The arguments are passed in to the java program through the ARGS variable.

```shell
$ make build
mvn clean
...
mvn compile
...
mvn assembly:single
...

$ make run ARGS='--help'
java -jar target/*.jar --help
usage: 
        tracer [options]
        stdin: {"source?": "string", "input"?: "string", "steps?": "number"}

Java tracer CLI

named arguments:
  -h, --help             show this help message and exit
  --server               Enable http server mode
  --port PORT            The server port
  --pretty               Pretty print output
  --test                 Run the test code
```

This tool provides three ways to execute, they are:

### Server

```shell
$ make build
$ make run ARGS='--server'
java -jar target/*.jar --server
SLF4J: Failed to load class "org.slf4j.impl.StaticLoggerBinder".
SLF4J: Defaulting to no-operation (NOP) logger implementation
SLF4J: See http://www.slf4j.org/codes.html#StaticLoggerBinder for further details.
 * Serving Spark app "Java Tracer"
 * Running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

The request must be provided through POST requests.

### Cloud Function

Before running the deploy command, you must login to your gcp account and `gcloud config set` for `project` and `function/region`.
You can also change the make command to set these properties.

This is a java 11 cloud function, it requires previous alpha registration to be able to use the java 11 runtime.

```shell
$ make deploy
gcloud alpha functions deploy java_tracer --entry-point Main --runtime java11 \
        --memory 1024MB --timeout 60s --max-instances 50 --allow-unauthenticated --trigger-http
Deploying function (may take a while - up to 2 minutes)...done.                                                                                                      
availableMemoryMb: 1024
entryPoint: Main
httpsTrigger:
  url: <function-url>
ingressSettings: ALLOW_ALL
labels:
  deployment-tool: cli-gcloud
maxInstances: 50
name: <function-name>
runtime: java11
serviceAccountEmail: <service-account>
sourceUploadUrl: <upload-url>
status: ACTIVE
timeout: 60s
updateTime: <date>
versionId: <version>
```

The request must be provided through POST requests.

### Terminal

```shell
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
