import json
import os
import pathlib

import flask

from tracer import tracer


def main():
    options = cli()
    server(options) if options.server else terminal(options)


def cli():
    import argparse
    parser = argparse.ArgumentParser(description='Python Tracer CLI', usage=argparse.SUPPRESS)
    parser.usage = '''
    tracer [options]
    request: {"source?": "string", "input"?: "string", "steps?": "number"}
    '''
    parser.add_argument('--server', default=False, action='store_true', help='Enable http server mode')
    parser.add_argument('--port', default=8000, help='The server port')
    parser.add_argument('--process', default=4, help='Number of server processes')
    parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source')
    options = parser.parse_args()
    return options


def server(options):
    app = flask.Flask('Python Tracer')
    app.add_url_rule('/', methods=['POST', 'OPTIONS'], view_func=lambda: cloud_python_tracer(flask.request))
    app.run(host='0.0.0.0', port=options.port, threaded=False, processes=options.process)


def terminal(options):
    request = json.loads(input())
    response = trace(request, options.test, options.pretty)
    print(response)


def cloud_python_tracer(request):
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '3600',
        'Content-Type': 'application/json'
    }
    if request.method == 'OPTIONS':
        return '', 204, headers
    elif request.method != 'POST':
        return 'not allowed', 405, headers
    test = request.args.get('test') == 'true'
    pretty = request.args.get('pretty') == 'true'
    request_body = request.get_json(silent=True)
    if request_body is None:
        return 'empty body', 400, headers
    response = trace(request_body, test, pretty)
    return response, 200, headers


def trace(request, test, pretty):
    tracer_request = {
        'source': request.get('source') if not test and request.get('source') is not None else
        pathlib.Path('./res/test.py').read_text(encoding='utf8') if test else '',
        'input': request.get('input') if request.get('input') is not None else '',
        'steps': min(max(0, request.get('steps')), 10000) if request.get('steps') is not None else 5000
    }
    tracer_response = tracer.Tracer(tracer_request).run()
    indent, separators = (4, None) if pretty else (None, (',', ':'))
    string_response = json.dumps(tracer_response, check_circular=False, indent=indent, separators=separators)
    return string_response


if __name__ == '__main__':
    main()
