FROM python:alpine

WORKDIR /app
ADD ./package.sh ./requirements.txt ./

RUN source package.sh setup && source package.sh install

ADD ./res ./res
ADD ./src ./src

ENTRYPOINT ["sh", "package.sh", "start"]
CMD ["--help"]