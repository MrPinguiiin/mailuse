# mailuse

Self-hosted disposable email service. Generate temporary inboxes, receive emails, auto-expire.

## Architecture

```
apps/
  api/     → Hono REST API (inbox CRUD, email lifecycle)
  web/     → SvelteKit dashboard (inbox generator, email viewer)
  smtp/    → SMTP receiver (inbound email processing)

packages/
  db/      → Prisma schema + client (PostgreSQL)
  shared/  → Types, Zod schemas, constants
  env/     → Environment variable validation
  config/  → Shared TypeScript config
  cli/     → Setup wizard (bunx @mailuse/cli)
  
infra/
  docker/      → docker-compose, Dockerfiles
  cloudflare/  → Wrangler config, D1 migrations, Email Worker
```

## Quick Start (Docker)

```bash
# Clone and start
git clone https://github.com/yourname/mailuse.git
cd mailuse

# Copy env and configure
cp .env.example .env
# Edit .env with your domain and passwords

# Start with Docker Compose
cd infra/docker
docker compose -f docker-compose.production.yml up -d
```

Services:
- Web UI: http://localhost:5173
- API: http://localhost:3000
- SMTP: port 25
- MinIO Console: http://localhost:9001

## Quick Start (Cloudflare)

```bash
bunx @mailuse/cli setup
```

The CLI wizard will:
1. Provision D1 database + R2 bucket
2. Run database migrations
3. Deploy API + web workers
4. Configure Email Routing
5. Print live URLs

## Development

```bash
# Install dependencies
bun install

# Generate Prisma client
bun run db:generate

# Push schema to local database
bun run db:push

# Start all services in dev mode
bun run dev
```

## Deploy Web + Docs to Vercel

The `apps/web` app contains both the public app and documentation pages:

- Main app: `/`
- Docs: `/docs`

Recommended Vercel project settings:

```txt
Root Directory: apps/web
Framework Preset: SvelteKit
Install Command: bun install
Build Command: bun run build
Output Directory: default
```

Environment variables for Vercel:

```env
PUBLIC_API_URL=https://api.yourdomain.com
PUBLIC_API_BASE=https://api.yourdomain.com
PUBLIC_APP_DOMAIN=yourdomain.com
PUBLIC_EMAIL_DOMAIN=yourdomain.com
PUBLIC_APP_NAME=mailuse
```

Domain pattern:

```txt
yourdomain.com       → Vercel project (app landing)
docs.yourdomain.com  → same Vercel project, rewritten to /docs
api.yourdomain.com   → VPS reverse proxy to apps/api
```

If you use a docs subdomain, update `apps/web/vercel.json` and replace `docs.mailuse.dev` with your real docs host.

## API Endpoints

```
POST   /api/v1/inboxes              → Create inbox
GET    /api/v1/inboxes/:address     → Get inbox
DELETE /api/v1/inboxes/:address     → Delete inbox

GET    /api/v1/inboxes/:address/emails           → List emails
GET    /api/v1/inboxes/:address/emails/:id       → Get email detail
DELETE /api/v1/inboxes/:address/emails/:id       → Delete email

GET    /api/v1/inboxes/:address/emails/:id/attachments/:attId → Download attachment

GET    /api/v1/domains              → List active domains
GET    /api/v1/health               → Health check
```

## DNS Setup (Docker/VPS)

```
MX    yourdomain.com    → your-server-ip (priority 10)
A     inbox.yourdomain.com → your-server-ip
A     api.yourdomain.com   → your-server-ip
```

Ensure port 25 is open on your VPS provider.

## Tech Stack

- **Runtime:** Bun
- **Monorepo:** Turborepo
- **API:** Hono
- **Web:** SvelteKit + TailwindCSS
- **SMTP:** smtp-server + mailparser
- **Database:** PostgreSQL (Docker) / D1 (Cloudflare)
- **Storage:** MinIO (Docker) / R2 (Cloudflare)
- **ORM:** Prisma
- **Validation:** Zod

## License

MIT
