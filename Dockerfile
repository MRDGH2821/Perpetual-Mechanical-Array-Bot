# Builder
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk update && apk add bash=~5 curl=~8 npm=~9 --no-cache

COPY . .

RUN npm install && npm run build

# Minimalistic image
FROM node:lts-slim
WORKDIR /app

COPY ./firebase-service-acc ./firebase-service-acc
COPY package.json ./

RUN npm install --omit=dev --omit=optional
COPY --from=builder /app/dist .

RUN useradd pma-bot

USER pma-bot

HEALTHCHECK NONE

ENTRYPOINT [ "npm", "start" ]
