FROM python:3.8-alpine

RUN apk add make

WORKDIR /app
ADD ./Dockerfile ./Makefile ./
ADD ./res ./res/
ADD ./src ./src/

ENTRYPOINT ["make", "run"]
