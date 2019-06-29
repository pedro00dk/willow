FROM python:alpine

WORKDIR /app
ADD ./package.sh ./
ADD ./res ./res/
ADD ./src ./src/

ENTRYPOINT ["sh", "package.sh", "start"]
