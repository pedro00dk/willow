FROM node:13-alpine

WORKDIR /app

RUN apk update &&\
    apk add docker &&\
    rm -rf /var/cache/apk/*

ADD ./package.json ./

RUN npm install

ADD ./tsconfig.json ./
ADD ./src ./src
ADD ./test ./test

CMD [ "npm", "run", "start" ]
