# Builder
FROM node:lts-alpine AS builder
WORKDIR /app

RUN apk update && apk add bash=~5 curl=~8 --no-cache

COPY . .

RUN npm install && npm run build

# Minimalistic image
FROM node:lts-slim
WORKDIR /app

COPY ./firebase-service-acc ./firebase-service-acc
COPY package.json ./

RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist

USER node

LABEL org.opencontainers.image.authors="MRDGH2821 <https://github.com/MRDGH2821>"
LABEL org.opencontainers.image.url=https://github.com/MRDGH2821/Perpetual-Mechanical-Array-Bot
LABEL org.opencontainers.image.documentation=https://github.com/MRDGH2821/Perpetual-Mechanical-Array-Bot#readme
LABEL org.opencontainers.image.source=https://github.com/MRDGH2821/Perpetual-Mechanical-Array-Bot
LABEL org.opencontainers.image.licenses=Unlicense
LABEL org.opencontainers.image.title="Perpetual Mechanical Array Bot"
LABEL org.opencontainers.image.description="Discord Bot for [Traveler Mains Server](https://discord.gg/RsdUnupKpj)"
LABEL org.opencontainers.image.base.name=docker.io/library/node:lts-slim

HEALTHCHECK CMD curl -k -f http://localhost:9000 || exit 1

ENTRYPOINT [ "npm", "start" ]
