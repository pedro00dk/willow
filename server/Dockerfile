FROM node:12-alpine

WORKDIR /app

RUN apk update &&\
    apk add docker &&\
    rm -rf /var/cache/apk/*

ADD ./package.json ./

RUN npm install &&\
    echo \
        '{"compilerOptions":{"downlevelIteration":true,"lib":["esnext"],"outDir": "./dist/","target":"es5"}}' \
        > ./tsconfig.json

ADD ./src ./src
ADD ./test ./test

CMD [ "npm", "run", "start" ]
