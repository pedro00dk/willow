FROM node:13-alpine

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./tsconfig.json ./
ADD ./public ./public
ADD ./src ./src

CMD [ "npm", "run", "serve-proxy" ]