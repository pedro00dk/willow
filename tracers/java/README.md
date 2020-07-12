# Java Tracer

A tool to inspect java code.
This tool analyses the execution of a source at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, the record is then returned.

The Makefile can be used to test, emulate and deploy the tracer (deployment requires gcloud configuration).

### Building

```shell
$ make build
mvn clean compile
...
```

### Testing

The source code and input are read from files in the `res` directory.

```shell
$ make test
...
```

### Emulator

```shell
$ # The request must be provided through POST requests.
$ make emulator
...
INFO: Serving function...
INFO: Function: Main
INFO: URL: http://localhost:8080/
```

#### Request Format

The request must be a POST and contain the content-type set to application/json.
The body must match the following properties:

```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided.",
    "steps": "the maximum number of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not counted."
}
```

### Cloud Function

Before running the deploy command, you must login to your gcp account and `gcloud config set` for `project` and `function/region`.
You can also change the make command to configure deployment options.

```shell
$ make deploy
gcloud alpha functions deploy java_tracer --entry-point Main --runtime java11 \
        --memory 1024MB --timeout 60s --max-instances 20 --allow-unauthenticated --trigger-http
Deploying function (may take a while - up to 2 minutes)...done.                                                                                                      
availableMemoryMb: 1024
entryPoint: Main
httpsTrigger:
  url: <function-url>
ingressSettings: ALLOW_ALL
labels:
  deployment-tool: cli-gcloud
maxInstances: 20
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
