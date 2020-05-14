import json
import os
import pathlib

import flask

from tracer import tracer


def terminal_tracer():
    import argparse
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.usage = 'tracer [options]\n  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}'
    parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source')
    options = parser.parse_args()

    json_input = json.loads(input())
    tracer_request = read_tracer_request(json_input, 'input', options.test)
    tracer_response = tracer.Tracer(tracer_request).run()
    indent, separators = (4, None) if options.pretty else (None, (',', ':'))
    print(json.dumps(tracer_response, check_circular=False, indent=indent, separators=separators), end='')


def server_tracer():
    app = flask.Flask('Python tracer Server')
    app.add_url_rule('/', methods=['POST', 'OPTIONS'], view_func=lambda: cloud_python_tracer(flask.request))
    return app


def cloud_python_tracer(request):
    headers = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
    headers['Access-Control-Allow-Methods'] = 'POST'
    if request.method == 'OPTIONS':
        headers['Access-Control-Allow-Headers'] = 'Content-Type'
        headers['Access-Control-Max-Age'] = '3600'
        return '', 204, headers
    elif request.method != 'POST':
        return 'method not allowed', 405
    test = request.args.get('test') == 'true'
    pretty = request.args.get('pretty') == 'true'
    json_body = request.get_json(silent=True)
    if json_body is None:
        return 'request body not provided: {"source?": "string", "input"?: "string", "steps?": "number"}', 400
    tracer_request = read_tracer_request(json_body, 'body', test)
    tracer_response = tracer.Tracer(tracer_request).run()
    return json.dumps(tracer_response, check_circular=False), 200, headers


def read_tracer_request(raw_json, name, test):
    raw_source = raw_json.get('source')
    raw_input = raw_json.get('input')
    raw_steps = raw_json.get('steps')
    return {
        'source': raw_source if not test and raw_source is not None else
        pathlib.Path('./res/test.py').read_text(encoding='utf8') if test else
        '',
        'input': raw_input if raw_input is not None else '',
        'steps': min(max(0, raw_steps), 10000) if raw_steps is not None else 5000
    }


if __name__ == '__main__':
    if os.environ.get('SERVER') != 'true':
        terminal_tracer()
    else:
        server_tracer().run(host='0.0.0.0', port=8000)
