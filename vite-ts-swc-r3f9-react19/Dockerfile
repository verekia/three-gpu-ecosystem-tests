FROM node:20.18.1-alpine3.19

WORKDIR /app

COPY package.json package-lock.json three-a0a25ea.tgz .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4173

CMD ["npm", "start"]
