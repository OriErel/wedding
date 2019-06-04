
###### SERVER DOCKER

FROM golang:1.11.4 as go_builder
WORKDIR /go/src/

ENV GO111MODULE=on

COPY app/deployment/go.mod ./go.mod
COPY app/deployment/go.sum ./go.sum
RUN go mod download

COPY app/go-serve/ ./go-serve

RUN CGO_ENABLED=0 GOARCH=amd64 GOOS=linux go build -a -installsuffix cgo -ldflags '-s -w' -o serve ./go-serve

###### BUILDER DOCKER
FROM node:12.2-alpine as node_builder

RUN mkdir -p /sites/app
WORKDIR /sites/app

COPY package.json /sites/package.json
COPY yarn.lock /sites/yarn.lock

COPY app/package.json ./package.json

RUN yarn

COPY app/ ./

ENV NODE_ENV=production
RUN yarn build


###### PRODUCTION_DOCKER
FROM amazonlinux:2 as amazonlinux

FROM scratch

ENV PORT=3000
ENV SERVICE_NAME=app

COPY --from=amazonlinux /etc/ssl/certs/ca-bundle.crt /etc/ssl/certs/
COPY --from=go_builder /go/src/serve .
#COPY --from=go_builder /sites/public/dist /srv/http
#COPY --from=node_builder /sites/public/dist /srv/http
COPY --from=node_builder /sites/app/dist /srv/http

ENTRYPOINT ["/serve"]