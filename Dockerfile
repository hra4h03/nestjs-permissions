FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build
RUN pnpm prune --prod && wget -O - https://gobinaries.com/tj/node-prune | sh


FROM node:lts-alpine
WORKDIR /app

COPY  ./package.json ./pnpm-lock.yaml ./

EXPOSE 3000

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.env.production /app/.env

RUN wget -O - https://gobinaries.com/tj/node-prune | sh

CMD ["node_modules/pm2/bin/pm2-runtime", "dist/main.js"]
