FROM node:14-alpine

RUN apk update &&\
    apk add docker &&\
    rm -rf /var/cache/apk/*

WORKDIR /app

ADD ./package.json ./tsconfig.json ./

RUN npm install

ADD ./src ./src
ADD ./test ./test

ENTRYPOINT ["npm", "run", "start"]
