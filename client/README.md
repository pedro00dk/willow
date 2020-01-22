# Client

Willow front-end implementation. Contains the source that generates client bundle and a couple of scripts to help serve it. The client itself is just a bundle of files; so, besides npm scripts, there is no command line interface implemented in the client as in the api server. Therefore options are passed through environment variables.

## Serving the bundle

There are two scripts for serving the bundle, one for development and another for production purposes. They are respectively `npm run start:dev` and `npm run start`.

### Options (Environment variables)

-   PORT: Sets the static files server port (default: 1234).
-   SERVER: Sets the HTTP address of the api server. The behavior of this option depends on if the PROXY option is enable or not (required).
-   PROXY: (optional, not supported in development server)
    -   Id disabled: Client will access api server directly using SERVER (CORS must be enabled in client and server).
    -   If enabled: Client will use the bundle server where itself was fetched from as a reverse proxy to access the api server. The SERVER will be used by the bundle server to access the api server; so SERVER does not have to be accessible from the client, just from the bundle server.

### Examples:

note: All addresses are dummy.

---

bundle address: http://willow.xyz (public address)  
api address: http://willow-api.xyz (public address)

-   PORT: // not set (1234)
-   SERVER: http://willow-api.xyz
-   PROXY: //not set (0)

```
                            bundle fetch            +---------------+
                        +---------------------------| bundle server |
                        |   http://willow.xyz       +---------------+
+--------+   requests   |
| client |--------------+
+--------+              |
                        |   api requests            +---------------+
                        +---------------------------| api server    |
                            http://willow-api.xyz   +---------------+
```

---

bundle address: http://willow.xyz (public address)  
api address: http://willow-api.xyz (can be a public address, or private address visible only from the bundle server, localhost, docker address, etc)

-   PORT: // not set (1234)
-   SERVER: http://willow-api.xyz
-   PROXY: //not set (0)

```
+--------+   all requests              +---------------+
| client |-----------------------------| bundle server |
+--------+   http://willow.xyz         +---------------+
                                               |
                         http://willow-api.xyz | api requests
                                               | (redirected)
                                               |
                                       +---------------+
                                       | api server    |
                                       +---------------+
```

## Docker

The client bundle server image does not require especial options to build or run. However, the api server address and information must be set through environment variables (`--env`) when running the container. The container entrypoint runs the production server. Remember to expose ports if your configuration needs it.

```shell
$ docker image build --tag willow-client -- ./

$ # docker ENTRYPOINT='npm run start' CMD=''
$ # ex:
$ docker container run --rm --interactive --tty \
    --env 'PORT=80' \
    --env "SERVER=http://localhost:8000" \
    --env "PROXY=1" \
    willow-client npm run start:proxy
```
