# Python Tracer

A tool to inspect python code.
This tool analyses the execution of a script at each step.
Snapshots of the stack and heap, and errors generated during execution are composed in a record of the program states, the record is then returned.

The Makefile can be used to start the tracer in terminal or emulator modes, or deploy the function to the cloud (requires gcloud and authentication).

## Request Format

The request must be in the json format with the following properties:

```json
{
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided.",
    "steps": "the maximum number of steps the script can execute. It considers only steps in the provided script, API calls from other modules are not counted."
}
```

## Building

```shell
$ make build
python -m venv .venv
.venv/bin/pip install --upgrade pip
.venv/bin/pip install -r requirements.txt
...
```

## Terminal Mode

```shell
$ # ARGS provide options to enable pretty print (pretty) and run the test files (test)
$ # The request must be provided through standard input stream
$ make terminal --silent ARGS='pretty test'
{}
...

$ echo "{\"source\":\"print('hello world')\"}" | make terminal ARGS='pretty'
.venv/bin/python ./main.py terminal pretty
...
```

### Emulator Mode

```shell
$ # The request must be provided through POST requests.
$ make emulator
.venv/bin/functions-framework --target service --port 8081
[2020-07-07 19:45:12 -0300] [52263] [INFO] Starting gunicorn 20.0.4
[2020-07-07 19:45:12 -0300] [52263] [INFO] Listening at: http://0.0.0.0:8081 (52263)
[2020-07-07 19:45:12 -0300] [52263] [INFO] Using worker: threads
[2020-07-07 19:45:12 -0300] [52265] [INFO] Booting worker with pid: 52265

...
```

### Cloud Function

Before running the deploy command, you must login to your gcp account and `gcloud config set` for `project` and `function/region`.
You can also change the make command to configure deployment options.

```shell
$ make deploy
gcloud functions deploy python_tracer --entry-point service --runtime python37 \
        --memory 256MB --timeout 30s --max-instances 50 --allow-unauthenticated --trigger-http
Deploying function (may take a while - up to 2 minutes)...done.                                                                                                      
availableMemoryMb: 256
entryPoint: service
httpsTrigger:
  url: <function-url>
ingressSettings: ALLOW_ALL
labels:
  deployment-tool: cli-gcloud
maxInstances: 50
name: <function-name>
runtime: python37
serviceAccountEmail: <service-account>
sourceUploadUrl: <upload-url>
status: ACTIVE
timeout: 30s
updateTime: <date>
versionId: <version>
```

The request must be provided through POST requests.
