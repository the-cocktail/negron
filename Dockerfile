FROM node:9-alpine

WORKDIR /app

COPY . .

RUN npm install

CMD ["npm", "start"]
