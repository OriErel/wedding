###### BUILDER DOCKER
FROM node:12.2-alpine as builder

RUN npm i -g yarn@1.16.0

RUN mkdir -p /application/api
WORKDIR /application/api

RUN mkdir -p /application/packages
COPY packages/db /application/packages/db

COPY package.json /application/package.json
COPY yarn.lock /application/yarn.lock

COPY api/package.json ./package.json

RUN yarn

COPY api/ ./

RUN yarn build

WORKDIR /application/packages/db
RUN yarn build

###### PRODUCTION DOCKER

FROM node:12.2-alpine

ENV NODE_ENV=production
ENV SERVICE_NAME=api
RUN npm i -g yarn@1.16.0

RUN mkdir -p /application/api
WORKDIR /application/api

COPY --from=builder /application/api/dist /application/api/dist
COPY --from=builder /application/packages /application/packages
COPY --from=builder /application/package.json /application/package.json

COPY api/package.json ./package.json
RUN yarn --prod

COPY api/ ./

EXPOSE 3500

CMD [ "node", "bin/www" ]