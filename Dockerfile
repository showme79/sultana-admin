FROM node:18-alpine

RUN npm i npm@9 -g

WORKDIR /opt/sultana-admin

ARG GH_TOKEN
COPY lib ./lib
COPY package*.json .
COPY .npmrc .
RUN npm ci

COPY . .

ENV PUBLIC_URL=/admin
RUN npm run build

CMD ["npm", "run", "serve"]