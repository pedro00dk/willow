# Willow API

Exposes tracers cli through http api.
The api expects a set of optional arguments to work properly.
The `--tracer-command` option must be set for each available tracer that will be exposed by the api.
This option expects a tuple with the language of the tracer and the shell command to start it.

```shell
$ npm run start -- --help
Willow api for cli tracers

Options:
  --port                          Set the server port            [default: 8000]
  --tracer-command                Tracer <language> <command>            [array]
  --tracer-steps                  Maximum number of allowed steps of a program
                                                                 [default: 1000]
  --tracer-timeout                Maximum tracer run time (milliseconds)
                                                                 [default: 8000]
  --signed-steps                  Override --tracer-steps for signed users
                                                                        [number]
  --signed-timeout                Override --tracer-timeout for signed users
                                                                        [number]
  --authentication-enable         Enable google oauth routes for user signin
                                                                       [boolean]
  --authentication-client-id      Google oauth client id                [string]
  --authentication-client-secret  Google oauth client secret            [string]
  --database-enable               Enable user storage (requires authentication)
                                                                       [boolean]
  --database-url                  Connection url to mongo database      [string]
  --database-name                 The mongo database name      [default: "test"]
  --cors-whitelist                Allow cors clients suffixes ("," split) ("*"
                                  any)
                                  clients)                        [default: "*"]
  --verbose                       Increase log output                  [boolean]
  -h, --help                      Show help                            [boolean]

$ # npm run start does not have any tracer registered by default
$ # use --tracer <language> <command> to set tracers
$ # <command> ex: cd ../tracers/python && make run --silent
$ npm run start -- --port 80 --tracer-command python "${PYTHON_COMMAND}" --tracer-command java "${JAVA_COMMAND}"

$ # use the start:dev script to automatically register local tracers
$ npm run start:dev
```

## Signed options

The `--signed-steps` `--signed-timeout` options allow the specification of alternative `--tracer-steps` and `--tracer-timeout` for signed users.

Check tracers README.md files for more info.

## Authentication (google oauth)

To enable user authentication, the `--authentication-enable` flag must be set.
Then the other authentication options shall be configured with google oauth _clientID_ and _clientSecret_.
The callback uri must be set in google credentials to `${apiUrl}/api/authentication/callback`.

The authentication is saved as a token in the client cookies.

## Database (mongodb)

To enable database and save user information locally, the `--database-*` options must be set.
The authentication information sent to the client will change if database is enabled or not.
If database is not enabled, all user information is saved in the client, otherwise, only the key to access it.

Soon, enabling database will also allow the server to store user actions.

## Routes

### Authentication

```http
GET /api/authentication/signin
GET /api/authentication/callback
GET /api/authentication/signout
GET /api/authentication/user
```

### Tracer

-   List available languages. Languages are provided through the `--tracer-command` option when the server is started.

```http
GET /api/tracer/languages
```

-   Trace the source code.
    Step counts are not read from the _trace_ JSON, the step counts are only settable through the `--tracer-steps` option, which is then sent to tracers.
    Note that the content structure is similar to tracer request data, except it has the extra language field, but not the step field, which is provided by the api.

```http
POST /api/tracer/trace
Content-Type: application/json
{
    "language": "One of the available languages",
    "source": "A string of the program source code to be traced. If not provided, the tracer will use an empty string.",
    "input": "The string input to be provided to the program through stdin. It is optional, but the program might raise an EOFError if not enough input is provided."
}
```

## Docker

The server image does not require especial options to build or run.
However, it does not pack any tracer implementation inside it.
Remember to expose ports if your configuration needs it.

```shell
$ docker image build --tag willow-server -- ./

$ # docker ENTRYPOINT='npm run start' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty -- willow-server
$ docker container run --rm --interactive --tty -- willow-server -- --help
$ docker container run --rm --interactive --tty -- willow-server -- --tracer-command python "${PYTHON_COMMAND}"
```

There are three main options to run a server image with tracers.

-   Extend the current image by adding the tracers implementations.
    In this case, the tracers implementations would run inside the server container.
    The server container would have to provide support to every tracer, which are usually written in different languages.

-   The server image comes with docker installed, so it could be used as a host for other docker containers.
    This strategy also requires extending the image to build tracer images inside the server container.

-   **(recommended)** Mount the docker socket inside the server container.
    The server container will be able to start containers registered in the host.
    It allows independent building of the tracers and server, and require only minimal changes in server container run options.
    The docker script (runs on host but server container access it (and its I/O) through docker host socket)

    ```shell
    $ LANGUAGE='python'
    $ # --interactive enabled for communication through stdio
    $ COMMAND='docker run --rm --interactive --tty willow-python-tracer'

    $ # docker ENTRYPOINT='npm run start' CMD=''
    $ docker container run \
        --rm --interactive --tty \
        --volume /var/run/docker.sock:/var/run/docker.sock \ # mount socket
        -- \
        willow-server \
        -- \ # skip npm options
        --tracer-command "${LANGUAGE}" "${COMMAND}"
    ```
