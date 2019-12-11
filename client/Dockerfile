FROM node:13-alpine

WORKDIR /app
ADD ./package.json ./

RUN npm install

ADD ./.babelrc ./
ADD ./tsconfig.json ./
ADD ./public ./public
ADD ./src ./src

CMD [ "npm", "run", "start:proxy" ]