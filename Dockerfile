FROM node:16-alpine

COPY . /app
WORKDIR /app

EXPOSE 3030

CMD [ "node", "index.js" ]