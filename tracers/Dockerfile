FROM node:alpine

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./src ./src
ADD ./test ./test
ADD ./tsconfig.json ./

ENTRYPOINT [ "npm", "run", "start" ]
CMD [ "--", "--help" ]