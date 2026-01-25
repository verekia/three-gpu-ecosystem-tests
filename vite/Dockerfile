FROM node:25-alpine

WORKDIR /app

COPY package.json package-lock.json .
COPY r3f-723622e675a02234246aa1e4e49ace4b48e14410.tgz .

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 4173

CMD ["npm", "start"]
