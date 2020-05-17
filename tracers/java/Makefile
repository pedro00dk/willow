build:
	mvn clean
	mvn compile
	mvn assembly:single

run:
	java -jar target/*.jar ${ARGS}

deploy:
	gcloud alpha functions deploy java_tracer --entry-point Main --runtime java11 \
		--memory 1024MB --timeout 60s --max-instances 50 --allow-unauthenticated --trigger-http