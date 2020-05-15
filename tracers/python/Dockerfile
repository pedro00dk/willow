FROM python:3.8-alpine

RUN apk add make

WORKDIR /app

ADD ./Makefile ./requirements.txt ./
RUN make build

ADD ./main.py ./
ADD ./res ./res/
ADD ./tracer ./tracer/


CMD ["make", "run"]
