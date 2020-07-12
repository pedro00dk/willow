build:
	mvn clean compile

test: build
	mvn exec:exec

emulator: build
	mvn function:run

deploy: build
	# function deployment requires jar file in the target/ folder (pom.xml build directory can not be modified)
	mvn package
	gcloud beta functions deploy java_tracer --entry-point Main --runtime java11 \
		--memory 512MB --timeout 60s --max-instances 20 --allow-unauthenticated --trigger-http