FROM oven/bun:1.3-alpine AS base
WORKDIR /app

RUN apk add --no-cache docker-cli postgresql16-client curl bash

COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/updater ./apps/updater

RUN bun install

WORKDIR /app/packages/db
RUN DATABASE_URL=postgresql://mailuse:mailuse@localhost:5432/mailuse bun run db:generate

WORKDIR /app/apps/updater
EXPOSE 3010
CMD ["bun", "run", "src/index.ts"]
