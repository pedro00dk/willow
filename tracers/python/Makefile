setup:
	python -m venv .venv
	. .venv/bin/activate
	pip install -r requeriments.txt

server:
	FLASK_APP=main.py flask run

terminal:
	python ./main.py ${ARGS}

deploy:
	gcloud functions deploy cloud_python_tracer --runtime python37 --trigger-http --allow-unauthenticated