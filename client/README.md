# Willow Client

Willow front-end implementation.
Contains the source that generates client bundle and a couple of scripts to help serving it.
The client itself is just a bundle of files; so, besides npm scripts, there is no command line interface implemented in the client as in the api.
Therefore options are passed through environment variables.

## Serving the bundle

There are two scripts for serving the bundle, one for development and another for production purposes.
They are respectively `npm run start:dev` and `npm run start`.

### Options (Environment variables)

-   API: Set the url of the api, this environment variable is required (cross site resource sharing).
-   PORT: Set the client bundle server port (default: 1234).

## Docker

The client bundle server image does not require especial options to build or run.
However, the api url must be set through environment variables (`--env`) when running the container.
Remember to expose ports if your configuration needs it.

```shell
$ docker image build --tag willow-client -- ./

$ # docker ENTRYPOINT='npm run start' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty \
    --env "API=http://localhost:8000" \
    --env 'PORT=80' \
    willow-client
```
