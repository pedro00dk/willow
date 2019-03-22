FROM openjdk:12-alpine

WORKDIR /app
ADD ./lib ./lib
ADD ./res ./res
ADD ./src ./src
ADD ./package.sh ./

RUN source package.sh build

ENTRYPOINT ["sh", "package.sh", "start"]
CMD ["--help"]