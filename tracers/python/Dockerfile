FROM python:3.7-alpine

WORKDIR /app
ADD ./res ./res/
ADD ./src ./src/
ADD ./package.sh ./

CMD ["sh", "./package.sh", "start"]
