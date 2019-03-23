FROM node:alpine

WORKDIR /app

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


ENTRYPOINT [ "npm", "run", "start" ]
CMD [ "--", "--help" ]