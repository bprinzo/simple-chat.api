FROM node:18-alpine

RUN mkdir -p /usr/src/app/api

WORKDIR /usr/src/app/api

COPY . .

RUN yarn install

COPY . .