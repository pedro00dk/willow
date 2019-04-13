FROM node:alpine

WORKDIR /app
ADD ./package.json ./

RUN npm install

RUN echo \
    '{\
    "compilerOptions":{\
    "allowJs":true,\
    "downlevelIteration":true,\
    "lib":["dom", "esnext"],\
    "outDir": "./dist/",\
    "target":"esnext"\
    }\
    }' > ./tsconfig.json

ADD ./public ./public
ADD ./src ./src

ENTRYPOINT [ "npm", "run", "start" ]
CMD [ "--", "--help" ]