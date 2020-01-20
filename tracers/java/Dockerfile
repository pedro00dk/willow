FROM openjdk:13-alpine

RUN apk add make

WORKDIR /app

ADD ./Dockerfile ./Makefile ./
ADD ./lib ./lib
ADD ./res ./res
ADD ./src ./src

RUN make build

ENTRYPOINT ["make", "run"]
