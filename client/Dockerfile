FROM node:13-alpine

WORKDIR /app

ADD ./package.json ./tsconfig.json ./

RUN npm install

ADD ./public ./public
ADD ./src ./src

ENTRYPOINT [ "npm", "run", "start" ]
