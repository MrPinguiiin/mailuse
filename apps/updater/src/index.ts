import prisma from "@mailuse/db";
import { env } from "@mailuse/env/server";
import { Hono } from "hono";
import { serve } from "bun";

const app = new Hono();
const LOCK_ID = "singleton";
const LOCK_MS = 30 * 60 * 1000;
const INSTALL_DIR = process.env.INSTALL_DIR || "/root/mailuse-install";
const BACKUP_DIR = process.env.BACKUP_DIR || "/app/backups";

async function appendLog(jobId: string, message: string) {
  const line = `[${new Date().toISOString()}] ${message}`;
  const job = await prisma.updateJob.findUnique({ where: { id: jobId } });
  await prisma.updateJob.update({
    where: { id: jobId },
    data: { logs: `${job?.logs || ""}${line}\n` },
  });
}

async function phase(jobId: string, next: string) {
  await prisma.updateJob.update({ where: { id: jobId }, data: { status: "running", phase: next } });
  await appendLog(jobId, `Phase: ${next}`);
}

async function run(jobId: string, command: string, cwd = INSTALL_DIR) {
  await appendLog(jobId, `$ ${command}`);
  const proc = Bun.spawn(["bash", "-lc", command], { cwd, stdout: "pipe", stderr: "pipe" });
  const [stdout, stderr, code] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text(), proc.exited]);
  if (stdout.trim()) await appendLog(jobId, stdout.trim());
  if (stderr.trim()) await appendLog(jobId, stderr.trim());
  if (code !== 0) throw new Error(`Command failed (${code}): ${command}`);
  return stdout;
}

async function acquireLock(jobId: string) {
  const now = new Date();
  const existing = await prisma.updateLock.findUnique({ where: { id: LOCK_ID } });
  if (existing && existing.expiresAt > now) throw new Error("Another update is already running");
  await prisma.updateLock.upsert({
    where: { id: LOCK_ID },
    update: { lockedBy: jobId, lockedAt: now, expiresAt: new Date(now.getTime() + LOCK_MS) },
    create: { id: LOCK_ID, lockedBy: jobId, expiresAt: new Date(now.getTime() + LOCK_MS) },
  });
}

async function releaseLock() {
  await prisma.updateLock.deleteMany({ where: { id: LOCK_ID } });
}

async function backupDatabase(jobId: string) {
  await phase(jobId, "backup");
  await run(jobId, `mkdir -p ${BACKUP_DIR}`);
  const path = `${BACKUP_DIR}/mailuse-${Date.now()}.sql`;
  await run(jobId, `docker exec mailuse-install-postgres-1 pg_dump -U mailuse mailuse > ${path}`);
  await run(jobId, `test -s ${path}`);
  await prisma.updateJob.update({ where: { id: jobId }, data: { backupPath: path } });
  await run(jobId, `find ${BACKUP_DIR} -name 'mailuse-*.sql' -mtime +${env.UPDATE_BACKUP_RETENTION_DAYS} -delete`);
  return path;
}

async function healthCheck(jobId: string) {
  await phase(jobId, "health");
  for (let i = 1; i <= 3; i += 1) {
    try {
      await run(jobId, `curl -fsS http://api:3000/api/health`);
      await appendLog(jobId, "Health check passed");
      return;
    } catch (error) {
      await appendLog(jobId, `Health check attempt ${i} failed`);
      await new Promise((resolve) => setTimeout(resolve, i * 3000));
    }
  }
  throw new Error("Health check failed");
}

async function executeUpdate(jobId: string, releaseTag: string) {
  const started = Date.now();
  await acquireLock(jobId);
  try {
    await backupDatabase(jobId);
    await phase(jobId, "pull");
    await run(jobId, `curl -fsSL https://raw.githubusercontent.com/MrPinguiiin/mailuse/${releaseTag}/docker-compose.production.yml -o docker-compose.yml.next`);
    await phase(jobId, "build");
    await run(jobId, `docker compose -f docker-compose.yml.next build --no-cache`);
    await phase(jobId, "switch");
    await run(jobId, `mv docker-compose.yml docker-compose.yml.previous || true`);
    await run(jobId, `mv docker-compose.yml.next docker-compose.yml`);
    await run(jobId, `DOMAIN=${env.APP_DOMAIN} OWNER_PASSWORD='${env.OWNER_PASSWORD || ""}' LETSENCRYPT_EMAIL=${process.env.LETSENCRYPT_EMAIL || `admin@${env.APP_DOMAIN}`} docker compose up -d`);
    await healthCheck(jobId);
    await phase(jobId, "cleanup");
    await run(jobId, `docker image prune -f`);
    await prisma.updateJob.update({
      where: { id: jobId },
      data: { status: "success", phase: "done", completedAt: new Date(), durationSeconds: Math.floor((Date.now() - started) / 1000) },
    });
    await appendLog(jobId, "Update completed successfully");
  } catch (error: any) {
    await appendLog(jobId, `Update failed: ${error.message}`);
    await prisma.updateJob.update({ where: { id: jobId }, data: { status: "failed", errorMessage: error.message, errorStack: error.stack, completedAt: new Date() } });
    await run(jobId, `test -f docker-compose.yml.previous && mv docker-compose.yml.previous docker-compose.yml && docker compose up -d || true`).catch(() => null);
  } finally {
    await releaseLock();
  }
}

async function executeRollback(jobId: string, sourceJobId: string) {
  const source = await prisma.updateJob.findUnique({ where: { id: sourceJobId } });
  if (!source?.backupPath) throw new Error("No backup available");
  await acquireLock(jobId);
  try {
    await phase(jobId, "restore");
    await run(jobId, `docker exec -i mailuse-install-postgres-1 psql -U mailuse mailuse < ${source.backupPath}`);
    await run(jobId, `test -f docker-compose.yml.previous && mv docker-compose.yml.previous docker-compose.yml && docker compose up -d || docker compose up -d`);
    await healthCheck(jobId);
    await prisma.updateJob.update({ where: { id: jobId }, data: { status: "success", phase: "done", completedAt: new Date() } });
  } catch (error: any) {
    await prisma.updateJob.update({ where: { id: jobId }, data: { status: "failed", errorMessage: error.message, errorStack: error.stack, completedAt: new Date() } });
  } finally {
    await releaseLock();
  }
}

app.post("/run", async (c) => {
  const body = await c.req.json();
  executeUpdate(body.jobId, body.releaseTag);
  return c.json({ ok: true });
});

app.post("/rollback", async (c) => {
  const body = await c.req.json();
  executeRollback(body.jobId, body.sourceJobId);
  return c.json({ ok: true });
});

serve({ port: 3010, fetch: app.fetch });
console.log("mailuse updater listening on :3010");
