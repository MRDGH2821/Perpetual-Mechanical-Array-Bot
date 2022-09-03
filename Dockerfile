FROM node:lts

WORKDIR /pma_bot

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
