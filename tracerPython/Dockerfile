FROM python:alpine

WORKDIR /app
ADD ./res ./res
ADD ./src ./src
ADD ./package.sh ./

RUN source package.sh build

ENTRYPOINT ["source", "package.sh", "start"]
CMD ["--help"]