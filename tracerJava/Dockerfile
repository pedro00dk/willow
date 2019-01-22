FROM openjdk:12-alpine

WORKDIR /app
ADD ./lib ./lib
ADD ./res ./res
ADD ./src ./src

RUN javac -cp ./src/:./lib/* -d ./out/ --add-exports jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED ./src/Main.java

ENTRYPOINT ["java", "-cp", "./out/:./lib/*", "--add-exports", "jdk.jdi/com.sun.tools.jdi=ALL-UNNAMED", "Main"]
CMD ["--help"]