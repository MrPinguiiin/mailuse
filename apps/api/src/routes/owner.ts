import { env } from "@mailuse/env/server";
import prisma from "@mailuse/db";
import { generateId } from "@mailuse/shared/id";
import { Hono } from "hono";
import { createHash, timingSafeEqual } from "node:crypto";

export const ownerRoutes = new Hono();

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;
const GITHUB_RELEASE_URL = "https://api.github.com/repos/MrPinguiiin/mailuse/releases/latest";
const UPDATER_URL = process.env.UPDATER_URL || "http://updater:3010";

function ownerToken() {
  const secret = env.OWNER_PASSWORD || "";
  return createHash("sha256").update(`mailuse:${env.APP_DOMAIN}:${secret}`).digest("hex");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function clientIp(c: any) {
  return c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_LOGIN_ATTEMPTS) return false;
  current.count += 1;
  return true;
}

function requireOwner(c: any) {
  if (!env.OWNER_PASSWORD) {
    return c.json({ error: "Owner dashboard is not configured" }, 503);
  }

  const auth = c.req.header("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!safeEqual(token, ownerToken())) {
    return c.json({ error: "Unauthorized" }, 401);
  }
}

ownerRoutes.post("/owner/login", async (c) => {
  if (!env.OWNER_PASSWORD) {
    return c.json({ error: "Set OWNER_PASSWORD to enable owner dashboard" }, 503);
  }

  const ip = clientIp(c);
  if (!checkRateLimit(ip)) {
    return c.json({ error: "Too many login attempts. Try again later." }, 429);
  }

  const body = await c.req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (!safeEqual(password, env.OWNER_PASSWORD)) {
    return c.json({ error: "Invalid password" }, 401);
  }

  loginAttempts.delete(ip);
  return c.json({ token: ownerToken() });
});

ownerRoutes.get("/owner/me", (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  return c.json({ domain: env.APP_DOMAIN, appName: env.APP_NAME });
});

ownerRoutes.get("/owner/stats", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const now = new Date();
  const [totalInboxes, activeInboxes, deletedInboxes, totalEmails, emailsToday] = await Promise.all([
    prisma.inbox.count(),
    prisma.inbox.count({ where: { isDeleted: false, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.inbox.count({ where: { isDeleted: true } }),
    prisma.email.count(),
    prisma.email.count({ where: { receivedAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } }),
  ]);

  return c.json({ totalInboxes, activeInboxes, deletedInboxes, totalEmails, emailsToday });
});

ownerRoutes.get("/owner/inboxes", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const inboxes = await prisma.inbox.findMany({
    where: { isDeleted: false },
    orderBy: [{ lastEmailAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    include: { _count: { select: { emails: true } } },
  });

  return c.json({
    inboxes: inboxes.map((inbox) => ({
      address: inbox.address,
      expiresAt: inbox.expiresAt?.toISOString() ?? null,
      createdAt: inbox.createdAt.toISOString(),
      lastEmailAt: inbox.lastEmailAt?.toISOString() ?? null,
      emailCount: inbox._count.emails,
    })),
  });
});

ownerRoutes.get("/owner/domains", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const domains = await prisma.domain.findMany({
    orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
    include: { _count: { select: { inboxes: true } } },
  });

  return c.json({
    domains: domains.map((domain) => ({
      id: domain.id,
      domain: domain.domain,
      providerType: domain.providerType,
      isActive: domain.isActive,
      createdAt: domain.createdAt.toISOString(),
      inboxCount: domain._count.inboxes,
    })),
  });
});

ownerRoutes.get("/owner/api", (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  return c.json({
    token: ownerToken(),
    endpoints: [
      { method: "POST", path: "/api/v1/inboxes", description: "Create or reopen an inbox" },
      { method: "GET", path: "/api/v1/inboxes/:address", description: "Get inbox metadata" },
      { method: "GET", path: "/api/v1/inboxes/:address/emails", description: "List emails" },
      { method: "GET", path: "/api/v1/inboxes/:address/emails/:emailId", description: "Read one email" },
      { method: "DELETE", path: "/api/v1/inboxes/:address/emails/:emailId", description: "Delete one email" },
      { method: "DELETE", path: "/api/v1/inboxes/:address", description: "Delete inbox" },
    ],
  });
});

ownerRoutes.get("/owner/update/latest", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const res = await fetch(GITHUB_RELEASE_URL, { headers: { "User-Agent": "mailuse" } });
  if (!res.ok) return c.json({ error: "No GitHub release found" }, 502);
  const release = await res.json();

  return c.json({
    currentVersion: env.APP_VERSION,
    latestVersion: release.tag_name,
    name: release.name || release.tag_name,
    url: release.html_url,
    publishedAt: release.published_at,
    body: release.body || "",
    updateAvailable: release.tag_name !== env.APP_VERSION,
  });
});

ownerRoutes.post("/owner/update/trigger", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const latest = await fetch(GITHUB_RELEASE_URL, { headers: { "User-Agent": "mailuse" } });
  if (!latest.ok) return c.json({ error: "Failed to fetch latest release" }, 502);
  const release = await latest.json();

  const running = await prisma.updateJob.findFirst({ where: { status: { in: ["pending", "running"] } } });
  if (running) return c.json({ error: "Update already in progress", jobId: running.id }, 409);

  const job = await prisma.updateJob.create({
    data: {
      id: generateId("upd"),
      triggeredBy: "owner",
      triggeredByIp: clientIp(c),
      fromVersion: env.APP_VERSION,
      toVersion: release.tag_name,
      releaseName: release.name || release.tag_name,
      releaseUrl: release.html_url,
      status: "pending",
      strategy: "blue-green",
    },
  });

  const res = await fetch(`${UPDATER_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId: job.id, releaseTag: release.tag_name }),
  }).catch((error) => ({ ok: false, error }) as any);

  if (!res.ok) {
    await prisma.updateJob.update({ where: { id: job.id }, data: { status: "failed", errorMessage: "Failed to start updater" } });
    return c.json({ error: "Failed to start updater" }, 500);
  }

  return c.json({ jobId: job.id, releaseTag: release.tag_name }, 202);
});

ownerRoutes.get("/owner/update/status/:jobId", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const job = await prisma.updateJob.findUnique({ where: { id: c.req.param("jobId") } });
  if (!job) return c.json({ error: "Job not found" }, 404);
  return c.json(job);
});

ownerRoutes.get("/owner/update/history", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const jobs = await prisma.updateJob.findMany({ orderBy: { startedAt: "desc" }, take: 20 });
  return c.json({ jobs });
});

ownerRoutes.post("/owner/update/rollback/:jobId", async (c) => {
  const unauthorized = requireOwner(c);
  if (unauthorized) return unauthorized;

  const source = await prisma.updateJob.findUnique({ where: { id: c.req.param("jobId") } });
  if (!source || source.status !== "success" || !source.backupPath) {
    return c.json({ error: "This update cannot be rolled back" }, 400);
  }

  const job = await prisma.updateJob.create({
    data: {
      id: generateId("upd"),
      triggeredBy: "owner",
      triggeredByIp: clientIp(c),
      fromVersion: source.toVersion,
      toVersion: source.fromVersion,
      releaseName: `Rollback to ${source.fromVersion}`,
      releaseUrl: source.releaseUrl,
      status: "pending",
      strategy: "rollback",
      rollbackJobId: source.id,
    },
  });

  const res = await fetch(`${UPDATER_URL}/rollback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobId: job.id, sourceJobId: source.id }),
  }).catch((error) => ({ ok: false, error }) as any);

  if (!res.ok) {
    await prisma.updateJob.update({ where: { id: job.id }, data: { status: "failed", errorMessage: "Failed to start rollback" } });
    return c.json({ error: "Failed to start rollback" }, 500);
  }

  return c.json({ jobId: job.id }, 202);
});
