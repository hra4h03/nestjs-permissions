FROM node:lts-alpine as builder

WORKDIR /app

COPY ./package.json ./pnpm-lock ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile --production=true

COPY . .
RUN yarn build:swc

FROM node:lts-alpine
WORKDIR /app

COPY  ./package.json ./yarn.lock ./
RUN pnpm install --frozen-lockfile --production=true
RUN pnpm add pm2 -g

EXPOSE 3000

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/.env.production /app/.env

CMD ["yarn", "start:prod"]
