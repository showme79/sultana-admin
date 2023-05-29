FROM node:18-alpine

RUN npm i npm@9 -g

WORKDIR /opt/sultana-admin

ARG GH_TOKEN
COPY lib ./lib
COPY package*.json .
COPY .npmrc .
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=development
ENV PORT=3000

CMD ["npm", "run", "serve"]