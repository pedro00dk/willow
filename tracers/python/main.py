import os

from tracer import tracer


def server_tracer():
    import flask
    app = flask.Flask('Python tracer Server')
    app.add_url_rule('/', methods=['POST', 'OPTIONS'], view_func=lambda: cloud_python_tracer(flask.request))
    return app


def cloud_python_tracer(request):
    headers = {'Access-Control-Allow-Origin': '*'}
    headers['Access-Control-Allow-Methods'] = 'POST'
    if request.method == 'OPTIONS':
        headers['Access-Control-Allow-Headers'] = 'Content-Type'
        headers['Access-Control-Max-Age'] = '3600'
        return '', 204, headers
    elif request.method != 'POST':
        return 'method not allowed', 405

    json_body = request.get_json(silent=True)
    if json_body is None:
        return 'request body not provided: {"source?": "string", "input"?: "string", "steps?": "number"}', 400
    pretty = request.args.get('pretty') == 'true'
    test = request.args.get('test') == 'true'
    tracer_request = read_trace_request(json_body, 'body', test)
    tracer_response = tracer.Tracer(tracer_request).run()
    return tracer_response, 200


def terminal_tracer():
    import argparse
    import json
    parser = argparse.ArgumentParser(description='Python tracer CLI', usage=argparse.SUPPRESS)
    parser.usage = 'tracer [options]\n  stdin: {"source?": "string", "input"?: "string", "steps?": "number"}'
    parser.add_argument('--pretty', default=False, action='store_true', help='Pretty print output')
    parser.add_argument('--test', default=False, action='store_true', help='Run the test source')
    options = parser.parse_args()

    json_input = json.loads(input())
    tracer_request = read_trace_request(json_input, 'input', options.test)
    tracer_response = tracer.Tracer(tracer_request).run()
    indent, separators = (4, None) if options.pretty else (None, (',', ':'))
    print(json.dumps(tracer_response, check_circular=False, indent=indent, separators=separators), end='')


def read_trace_request(raw_json, name, test):
    import pathlib
    raw_source = raw_json.get('source')
    raw_input = raw_json.get('input')
    raw_steps = raw_json.get('steps')
    return {
        'source': raw_source if not test and raw_source is not None else
        pathlib.Path('./res/main.py').read_text(encoding='utf8') if test else
        '',
        'input': raw_input if raw_input is not None else '',
        'steps': min(max(0, raw_steps), 10000) if raw_steps is not None else 5000
    }


if __name__ == '__main__':
    terminal_tracer()
elif __name__ == 'main' and os.environ.get('FLASK_APP') is not None:
    app = server_tracer()
