# Tracer Server

Exposes tracers CLI through HTTP API.

```shell
$ npm run start -- --help
Willow API for CLI Tracers

Options:
  --clients   Client origin (enable CORS)                         [default: "*"]
  --debug     Log traces calls and results                             [boolean]
  --port      Set the server port                                [default: 8000]
  --steps     Maximum number of a program being traced           [default: 1000]
  --timeout   Maximum tracer run time (milliseconds)             [default: 8000]
  --tracer    Tracer <language> <command>                                [array]
  -h, --help  Show help                                                [boolean]

$ # npm run start does not have any tracer registered by default
$ # use --tracer <language> <command> to set tracers
$ # <command> ex: cd ../tracers/python && make run --silent
$ npm run start -- --port 80 --tracer python <cmd> --tracer java <cmd>

$ # the start:t script automatically registers the local tracers
$ npm tun start:t
```

The tracer server expects a set of optional arguments to work properly.
The `--tracer` option must be set for each available tracer that will be exposed by the server.
This option expects a tuple with the language of the tracer and the shell command to start it.

Check tracers README.md files for more info.

## Routes

* List available languages. Languages are provided through the `--tracer` option when the server is started.
```http
GET /languages
```

* Trace the source code. Step counts are not read from the *trace* JSON, the step counts are only settable through the `--steps` option, which is then sent to tracers.
```http
POST /trace
Content-Type: application/json
{
    "language": "One of the available languages",
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided."
}
```

## Docker

The server image does not require especial options to build or run. However, it does not pack any tracer implementation inside it.

```shell
$ docker image build --tag willow-server -- ./

$ # docker ENTRYPOINT='npm run start' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty -- willow-server -- --help
$ docker container run --rm --interactive --tty -- willow-server
```


There are three main options to run a server image with tracers.

* Extend the current image by adding the tracers implementations. In this case, the tracers implementations would run inside the server container. The server container would have to provide support to every tracer, which are usually written in different languages.

* The server image comes with docker installed, so it could be used as a host for other docker containers. This strategy also requires extending the image to build tracer images inside the server container.

* **(recommended)** Mount the docker socket inside the server container. The server container will be able to start containers registered in the host. It allows independent building of the tracers and server, and require only minimal changes in server container run options.
    ```shell
    $ docker container run \
        --rm --interactive --tty \
        --volume /var/run/docker.sock:/var/run/docker.sock \ # mount socket
        -- \
        willow-server \ # ENTRYPOINT='npm run start'
        -- \ # skip npm options (script options here)
        --tracer python 'docker run --rm -i willow-tracer-python' # docker script (runs on host but server container access it (and its I/O) through docker host socket)
    ```
