# Tracer Server

Exposes CLI tracers through HTTP API. Check tracers README files for more info.

```
Willow API for CLI Tracers

Options:
  --clients   Client origin (enable CORS)                         [default: "*"]
  --port      Set the server port                                [default: 8000]
  --steps     Maximum number of a program being traced           [default: 1000]
  --timeout   Maximum tracer run time (milliseconds)             [default: 8000]
  --tracer    Tracer <language> <command>                                [array]
  -h, --help  Show help                                                [boolean]
```

The tracer server expects a set of optional arguments to work properly.
The `--tracer` option must be set for each available tracer that will be exposed by the server.
This argument expects a tuple with the language of the tracer and the shell command to start it.
