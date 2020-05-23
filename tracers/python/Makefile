build:
	python -m venv .venv
	.venv/bin/pip install -r requirements.txt

terminal:
	.venv/bin/python ./main.py terminal ${ARGS}

emulator:
	.venv/bin/functions-framework --target service ${ARGS}

deploy:
	gcloud functions deploy python_tracer --entry-point service --runtime python37 \
		--memory 256MB --timeout 30s --max-instances 50 --allow-unauthenticated --trigger-http