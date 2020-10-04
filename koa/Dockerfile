FROM node:14-alpine

WORKDIR /root/koa
COPY package.json /root/koa
RUN yarn install
COPY ./tsconfig.json /root/koa
COPY ./src /root/koa/src
RUN yarn build
CMD node ./dist/index.js