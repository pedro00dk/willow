FROM python:3.8-alpine

RUN apk add make

WORKDIR /app
ADD ./res ./res/
ADD ./src ./src/
ADD ./Dockerfile ./Makefile ./

ENTRYPOINT ["make", "run"]
