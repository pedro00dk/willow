# Java Tracer

A tool to inspect java code.
This tool analyses the execution of a source at each step.
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
mvn clean compile
...
```

## Terminal Mode

```
$ make terminal
...
[INFO] --- exec-maven-plugin:1.6.0:exec (default-cli) @ java-tracer ---

```

## Emulator Mode

```
$ make emulator
...
[INFO] Calling Invoker with [--classpath, /home/pedro/Documents/Projects/willow/tracers/java/out/classes:/home/pedro/.m2/repository/com/google/cloud/functions/functions-framework-api/1.0.1/functions-framework-api-1.0.1.jar:/home/pedro/.m2/repository/com/google/code/gson/gson/2.8.6/gson-2.8.6.jar, --target, Main]
[INFO] Logging initialized @2898ms to org.eclipse.jetty.util.log.Slf4jLog
[INFO] jetty-9.4.26.v20200117; built: 2020-01-17T12:35:33.676Z; git: 7b38981d25d14afb4a12ff1f2596756144edf695; jvm 13.0.2+8
[INFO] Started o.e.j.s.ServletContextHandler@28f9fedd{/,null,AVAILABLE}
[INFO] Started ServerConnector@4c7e978c{HTTP/1.1,[http/1.1]}{0.0.0.0:8080}
[INFO] Started @3128ms
INFO: Serving function...
INFO: Function: Main
INFO: URL: http://localhost:8080/
```

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
