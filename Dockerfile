FROM node:18

RUN mkdir -p /usr/src/bot && chown -R node:node /usr/src/bot
USER node

WORKDIR /usr/src/bot

COPY ./src/package.json /usr/src/bot
RUN npm install

COPY ./src /usr/src/bot

CMD ["node", "index.js"]
