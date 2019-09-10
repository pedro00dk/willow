FROM openjdk:12-alpine

WORKDIR /app
ADD ./package.sh ./
ADD ./lib ./lib
ADD ./res ./res
ADD ./src ./src

RUN . package.sh build

CMD ["sh", "package.sh", "start"]
