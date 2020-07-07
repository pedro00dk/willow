build:
	python -m venv .venv
	.venv/bin/pip install --upgrade pip
	.venv/bin/pip install -r requirements.txt

terminal: build
	.venv/bin/python ./main.py terminal ${ARGS}

emulator: build
	.venv/bin/functions-framework --target service --port 8081

deploy:
	gcloud functions deploy python_tracer --entry-point service --runtime python37 \
		--memory 256MB --timeout 30s --max-instances 50 --allow-unauthenticated --trigger-http