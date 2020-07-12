build:
	python -m venv .venv
	.venv/bin/pip install --upgrade pip
	.venv/bin/pip install -r requirements.txt

test: build
	.venv/bin/python ./main.py test

emulator: build
	.venv/bin/functions-framework --target service --port 8081

deploy:
	gcloud functions deploy python_tracer --entry-point service --runtime python38 \
		--memory 256MB --timeout 30s --max-instances 20 --allow-unauthenticated --trigger-http