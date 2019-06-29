FROM openjdk:13-alpine

WORKDIR /app
ADD ./package.sh ./
ADD ./lib ./lib
ADD ./res ./res
ADD ./src ./src

RUN . package.sh build

ENTRYPOINT ["sh", "package.sh", "start"]
