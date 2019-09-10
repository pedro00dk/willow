FROM python:3.7-alpine

WORKDIR /app
ADD ./package.sh ./
ADD ./res ./res/
ADD ./src ./src/

CMD ["sh", "package.sh", "start"]
