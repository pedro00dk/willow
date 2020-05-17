FROM maven:3-openjdk-14 as build

WORKDIR /app

ADD ./Makefile ./pom.xml ./
ADD ./src ./src

RUN mvn clean && mvn compile && mvn assembly:single

FROM openjdk:14-alpine

RUN apk add make

WORKDIR /app

COPY --from=build /app/Makefile /app/pom.xml /app/
COPY --from=build /app/target/ /app/target/

CMD ["make", "run"]
