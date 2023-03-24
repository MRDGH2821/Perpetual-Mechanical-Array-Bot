# Builder
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk update && apk add bash curl npm && rm -rf /var/cache/apk/*

# Download node-prune
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

COPY package*.json ./
RUN npm i
COPY . .

RUN npm prune --production
RUN /usr/local/bin/node-prune


# Minimalistic image
FROM node:lts-slim
WORKDIR /app

COPY ./firebase-service-acc ./firebase-service-acc
COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

RUN useradd pma-bot

USER pma-bot

HEALTHCHECK NONE

ENTRYPOINT [ "npm", "start" ]