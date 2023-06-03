FROM node:latest

RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY ./src/package.json /usr/src/bot
RUN npm install

COPY ./src /usr/src/bot

CMD ["node", "index.js"]
