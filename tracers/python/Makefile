build:
	python -m venv .venv
	.venv/bin/pip install -r requirements.txt

run:
	.venv/bin/python ./main.py ${ARGS}

deploy:
	gcloud functions deploy cloud_python_tracer --runtime python37 --trigger-http --allow-unauthenticated
