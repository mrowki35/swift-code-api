FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm install -g typescript && npx tsc

EXPOSE 8080

CMD ["node", "dist/server.js"]
