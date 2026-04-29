FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server.ts ./

EXPOSE 3000

ENV NODE_ENV=production
CMD ["npx", "tsx", "server.ts"]
