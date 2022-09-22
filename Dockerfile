FROM node:lts-slim

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

COPY ./firebase-service-acc ./firebase-service-acc

RUN npm install --omit=dev

COPY ./out ./out

RUN useradd pma-bot

USER pma-bot

HEALTHCHECK NONE

CMD ["node", "./out/index.js"]
