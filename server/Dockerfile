FROM node:alpine

WORKDIR /app

RUN apk update &&\
    apk add docker &&\
    rm -rf /var/cache/apk/*

ADD ./package.json ./

RUN npm install

RUN echo \
    '{\
    "compilerOptions":{\
    "allowJs":true,\
    "downlevelIteration":true,\
    "lib":["esnext"],\
    "outDir": "./dist/",\
    "target":"es5"\
    }\
    }' > ./tsconfig.json

ADD ./src ./src
ADD ./test ./test

ENTRYPOINT [ "npm", "run", "start-base" ]
CMD [ "--", "--help" ]