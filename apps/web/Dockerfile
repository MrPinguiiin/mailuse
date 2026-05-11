FROM oven/bun:1.3-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/
COPY packages/config/package.json ./packages/config/
COPY packages/env/package.json ./packages/env/
RUN bun install

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/web
RUN bun run build

# Production
FROM base AS production
COPY --from=build /app/apps/web/build ./build
COPY --from=build /app/apps/web/package.json ./

EXPOSE 3000
ENV PORT=3000
CMD ["bun", "run", "build/index.js"]
