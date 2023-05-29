FROM node:18-alpine

RUN npm i npm@9 -g

WORKDIR /opt/sultana-admin
COPY lib ./lib
COPY package*.json .
COPY .npmrc .
RUN npm ci

COPY . .

ENV NODE_ENV=development
ENV PORT=3000

CMD ["npm", "start"] 