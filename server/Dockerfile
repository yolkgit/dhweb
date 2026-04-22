FROM node:18-alpine
RUN apk add --no-cache openssl
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npx prisma generate

EXPOSE 3004

CMD ["node", "server.js"]
