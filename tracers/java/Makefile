build:
	mvn clean compile

terminal: build
	mvn exec:exec

emulator: build
	mvn function:run

deploy:
	gcloud functions deploy java_tracer --entry-point Main --runtime java11 \
		--memory 1024MB --timeout 60s --max-instances 50 --allow-unauthenticated --trigger-http