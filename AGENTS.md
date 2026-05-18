# AGENTS.md

## Scope
- Product name is `mailuse`; do not reintroduce CloakMail/clockmail branding.
- Public landing/docs live in `apps/web`; the actual mail service is the VPS Docker stack, not Vercel.
- Landing page focus: edit `apps/web/src/routes/+page.svelte`, shared public header in `apps/web/src/components/Header.svelte`, and docs under `apps/web/src/routes/docs/*`.

## Commands
- Install with Bun `1.3.x`: `bun install`.
- Root commands: `bun run build`, `bun run check-types`, `bun run dev`, `bun run dev:web`, `bun run dev:api`, `bun run dev:smtp`.
- Focused web verification: `cd apps/web && bun run build`.
- Focused API verification: `cd apps/api && bun run build`.
- Prisma client/codegen: `bun run db:generate`; local schema push: `bun run db:push`.
- `bun run check` only exists in `apps/web`, not at repo root.

## Verification Caveats
- This repo has previously hit broken local TypeScript installs around `typescript@6.0.3`; if `svelte-check` or `tsc -b` fails inside `node_modules/.bun/typescript`, treat it as dependency/environment until a build proves otherwise.
- Web builds use SvelteKit node adapter locally/Docker, but switch to static adapter when `VERCEL` is set.
- Do not commit generated outputs: `node_modules`, `dist`, `.svelte-kit`, `build`, `apps/web/public`, Prisma generated client, or `.env` files.

## Architecture
- `apps/api`: Hono REST API, owner dashboard API, update trigger endpoints.
- `apps/web`: SvelteKit landing page, docs, public inbox UI, and owner dashboard.
- `apps/smtp`: SMTP receiver and inbound mail parser.
- `apps/updater`: internal updater service called by API at `http://updater:3010`.
- `packages/db`: Prisma schema split under `packages/db/prisma/schema`; production compose runs `bun run db:deploy` (`prisma db push --accept-data-loss`).
- `packages/env`: server/browser env validation; many services import this at startup, so missing env can break even syntax-style checks.

## Landing/Vercel Notes
- Vercel is for marketing/docs/static web only. It cannot run SMTP port 25 or the active inbox stack.
- `apps/web/svelte.config.js` prerenders all entries and writes static Vercel output to `apps/web/public` when `VERCEL` is set.
- Root `vercel.json` and `apps/web/vercel.json` provide fallback rewrites to `/200.html`; keep both unless deployment root is standardized.
- Preserve the existing design system/shadcn-svelte components in `apps/web/src/lib/components/ui` rather than inventing parallel UI primitives.

## VPS/Docker Operations
- Primary install file is root `docker-compose.production.yml`; keep `infra/docker/docker-compose.production.yml` in sync when changing production stack behavior.
- Safe manual update command must include the persisted secrets, otherwise Postgres/MinIO auth can break:
  `DOMAIN=... OWNER_PASSWORD='...' LETSENCRYPT_EMAIL=... POSTGRES_PASSWORD='...' MINIO_ROOT_PASSWORD='...' APP_VERSION='vX.Y.Z' docker compose up -d --build`
- Never suggest `docker compose down -v` for normal updates; it deletes DB/mail/MinIO/update backups and can delete Traefik ACME certs.
- Keep Cloudflare `mail` record DNS-only; Cloudflare proxy does not handle SMTP port 25. `api`, `inbox`, and `dashboard` may be proxied with SSL mode `Full` while Traefik certs are not trusted.
- Traefik is pinned to `v2.11` with `DOCKER_API_VERSION=1.44`; this avoided Docker API compatibility failures seen with Traefik v3.

## Updater Gotchas
- UI updates call API `POST /api/v1/owner/update/trigger`, which calls `apps/updater` at `http://updater:3010/run`.
- The updater must not recreate itself during the critical switch; update app services first, mark/health-check success, then refresh updater in the background.
- Stale update jobs are stored in Postgres `update_jobs`; owner routes auto-mark old pending/running jobs as failed, but a broken updater service still causes `Failed to start updater`.
- For updater debugging on VPS, check `docker compose ps`, `docker compose logs updater api migrate`, and from API container verify `http://updater:3010` is reachable.

## Release Workflow
- Owner dashboard update checks GitHub Releases, not commits on `main`. After code changes intended for VPS update, create a tag and GitHub release.
- Keep `APP_VERSION` aligned with the release tag in manual VPS updates; the dashboard compares `APP_VERSION` to the latest GitHub Release tag.
