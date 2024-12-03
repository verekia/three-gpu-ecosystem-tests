FROM node:20.18.1-alpine3.19

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

COPY . .

EXPOSE 4173

CMD ["npm", "start"]
