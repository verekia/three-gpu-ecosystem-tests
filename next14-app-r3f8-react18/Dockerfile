FROM node:20.18.1-alpine3.19

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
