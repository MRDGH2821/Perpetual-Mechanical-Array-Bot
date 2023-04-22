# Builder
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk update && apk add bash=~5 curl=~8 npm=~9 --no-cache && corepack enable && corepack prepare yarn@stable --activate && yarn set version berry

COPY . .

RUN yarn install

RUN yarn run build && yarn prod-install /app/build && cp -r dist /app/build

# Minimalistic image
FROM node:lts-slim
WORKDIR /app

COPY ./firebase-service-acc ./firebase-service-acc
COPY package*.json ./

COPY --from=builder /app/build .

RUN useradd pma-bot

USER pma-bot

HEALTHCHECK NONE

ENTRYPOINT [ "yarn", "start" ]
