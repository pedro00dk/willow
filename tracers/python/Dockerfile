FROM python:3.8-alpine

WORKDIR /app
ADD ./res ./res/
ADD ./src ./src/
ADD ./package.sh ./

CMD ["sh", "./package.sh", "start"]
