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
RUN bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
WORKDIR /app/packages/db
RUN bunx prisma generate
WORKDIR /app/apps/api
RUN bun run build

# Production
FROM base AS production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/packages/db/prisma/generated ./packages/db/prisma/generated
COPY --from=build /app/packages/db/prisma/schema ./packages/db/prisma/schema
COPY --from=build /app/packages/db/prisma.config.ts ./packages/db/prisma.config.ts
COPY --from=build /app/packages/env ./packages/env
COPY --from=build /app/packages/shared ./packages/shared

EXPOSE 3000
CMD ["bun", "run", "dist/index.mjs"]
