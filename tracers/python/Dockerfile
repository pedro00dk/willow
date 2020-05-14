FROM python:3.8-alpine

RUN apk add make

WORKDIR /app

ADD ./requeriments.txt ./
RUN pip install -r ./requeriments.txt

ADD ./main.py ./Makefile ./
ADD ./res ./res/
ADD ./tracer ./tracer/


CMD ["make", "terminal"]
