FROM node:alpine

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./src ./src
ADD ./tsconfig.json ./

ENTRYPOINT [ "npm", "run-script", "start" ]
CMD [ "--", "--help" ]