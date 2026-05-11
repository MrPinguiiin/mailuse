FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/env/package.json ./packages/env/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
RUN bun install

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/db/node_modules ./packages/db/node_modules
COPY . .
WORKDIR /app/packages/db
RUN DATABASE_URL=postgresql://mailuse:mailuse@localhost:5432/mailuse bun run db:generate
WORKDIR /app/apps/api
RUN bun run build

# Production
FROM base AS production
COPY --from=build /app /app
WORKDIR /app/apps/api

EXPOSE 3000
CMD ["bun", "run", "dist/index.mjs"]
