import json
import pathlib
import sys

from tracer import tracer


def service(request):
    """
    Trace service function used by the serveless framework.
    It can be tested locally with the functions-framework package.
    Request method must be POST (or OPTIONS for CORS), and contain the Content-Type set to application/json.
    The pretty and test options must be provided in the request parameters and set to true.
    The request body must match de following schema:

    {"source?": "string", "input"?: "string", "steps?": "number"}
    """
    try:
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
        request_body = request.get_json(silent=True)
        if request_body is None:
            return 'empty body', 400, headers
        response_body = trace(request_body)
        return response_body, 200, headers
    except Exception as e:
        return str(e), 500, headers


def trace(request, pretty=False):
    """
    Trace the received request and options, and return the response as a json string.
    """
    tracer_request = {
        'source': request.get('source') if request.get('source') is not None else '',
        'input': request.get('input') if request.get('input') is not None else '',
        'steps': min(max(0, request.get('steps')), 10000) if request.get('steps') is not None else 5000
    }
    tracer_response = tracer.Tracer(tracer_request).run()
    indent, separators = (4, None) if pretty else (None, (',', ':'))
    string_response = json.dumps(tracer_response, check_circular=False, indent=indent, separators=separators)
    return string_response


def test():
    """
    Test function used to debug the tracer.
    """
    request = {
        'source': pathlib.Path('./res/test.py').read_text(encoding='utf8'),
        'input': pathlib.Path('./res/input.txt').read_text(encoding='utf8'),
        'steps': 10000
    }
    response = trace(request, True)
    print(response)


if __name__ == '__main__':  # functions-framework import this module with __name__ == 'main', not '__main__'
    test()
