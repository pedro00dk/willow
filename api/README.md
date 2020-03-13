# Willow API

Exposes tracers cli through http api.
The `--trace` option must be set for each available tracer that will be exposed by the api.
This option expects a tuple with the language of the tracer and the shell command to start it.

```shell
$ npm run start -- --help

Willow api for cli tracers
Options:
  --tracer              Tracer <language> <command>                      [array]
  --steps               Maximum program size                      [default: 200]
  --timeout             Maximum tracer run time (milliseconds)   [default: 5000]
  --auth-steps          Override --steps for authenticated users [default: 1000]
  --auth-timeout        Override --timeout for authenticated users
                                                                 [default: 8000]
  --auth                Enable google oauth routes for user signin     [boolean]
  --auth-client-id      Google oauth client id                          [string]
  --auth-client-secret  Google oauth client secret                      [string]
  --db                  Enable user action storage if auth is enabled  [boolean]
  --db-url              Mongo daemon url                                [string]
  --db-name             Mongo db name                          [default: "test"]
  --cors                Allow cors clients suffixes ("," split) ("*" any)
                                                                  [default: "*"]
  --port                Server port                              [default: 8000]
  --verbose             Increase log output                            [boolean]
  -h, --help            Show help                                      [boolean]

$ # npm run start does not have any tracer registered by default
$ # use --tracer <language> <command> to set tracers
$ # <command> ex: cd ../tracers/python && make run --silent
$ npm run start -- --port 80 --tracer python "${PYTHON_COMMAND}" --tracer java "${JAVA_COMMAND}"

$ # use the start:dev script to automatically register local tracers
$ npm run start:dev
```

Check tracers README.md files for more info.

## Authentication (google oauth)

To enable user authentication, the `--auth` flag must be set.
Then the other authentication options shall be configured with google oauth _clientID_ and _clientSecret_.
The callback uri must be set in google credentials to `${apiUrl}/api/auth/callback`.

The authentication is saved as a token in the client cookies.
The `--auth-steps` `--auth-timeout` options allow the specification of alternative `--steps` and `--timeout` for authenticated users.

## Database (mongodb)

To enable database and save user information locally, the `--db` and `--db-*` options must be set.
The authentication information sent to the client will change if database is enabled or not.
If database is not enabled, all user information is saved in the client, otherwise, only the key to access it.
Enabling the database allows the server to store user actions for collecting metrics, programs the user may save and source examples.

## Routes

### Action

-   Sends a user action to the saver to store.

```http
POST /api/action/
```

Other routes such as `/api/auth/signin` and `/api/tracer/trace` will also store actions.

### Authentication

```http
GET /api/auth/signin
GET /api/auth/callback
GET /api/auth/signout
GET /api/auth/user
```

### Example

```http
GET /api/example/
POST /api/example/insert
```


### Program

```http
GET /api/program/
POST /api/program/insert
POST /api/program/delete
```

### Tracer

-   List available languages. Languages are provided through the `--tracer` option when the server is started.

```http
GET /api/tracer/languages
```

-   Trace the source code.
    Step counts are not read from the _trace_ JSON, the step counts are only settable through the `--steps` option, which is then sent to tracers.
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
$ docker image build --tag willow-api -- ./

$ # docker ENTRYPOINT='npm run start' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty -- willow-api
$ docker container run --rm --interactive --tty -- willow-api -- --help
$ docker container run --rm --interactive --tty -- willow-api -- --tracer python "${PYTHON_COMMAND}"
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
        willow-api \
        -- \ # skip npm options
        --tracer-command "${LANGUAGE}" "${COMMAND}"
    ```
