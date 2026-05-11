import { Hono } from "hono";

export const healthRoutes = new Hono();

healthRoutes.get("/health", (c) => {
  return c.json({
    status: "ok",
    smtp: "connected",
    redis: "not_used",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
