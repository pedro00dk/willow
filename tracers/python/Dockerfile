FROM python:alpine

WORKDIR /app
ADD ./package.sh ./requirements.txt ./

RUN . package.sh build

ADD ./res ./res
ADD ./src ./src

ENTRYPOINT ["sh", "package.sh", "start"]
CMD ["--help"]