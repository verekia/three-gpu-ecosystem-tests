FROM node:25-alpine

WORKDIR /app

COPY package.json package-lock.json .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4173

CMD ["npm", "start"]
