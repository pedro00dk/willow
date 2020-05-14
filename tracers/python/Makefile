setup:
	python -m venv .venv
	.venv/bin/pip install -r requeriments.txt

terminal:
	python ./main.py ${ARGS}

server:
	SERVER=true python ./main.py

deploy:
	gcloud functions deploy cloud_python_tracer --runtime python37 --trigger-http --allow-unauthenticated
