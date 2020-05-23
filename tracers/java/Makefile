build:
	mvn clean compile

terminal:
	mvn clean compile exec:exec

emulator:
	mvn clean function:run

deploy:
	gcloud alpha functions deploy java_tracer --entry-point Main --runtime java11 \
		--memory 1024MB --timeout 60s --max-instances 50 --allow-unauthenticated --trigger-http