import { env } from "@mailuse/env/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import { inboxRoutes } from "./routes/inboxes";
import { emailRoutes } from "./routes/emails";
import { domainRoutes } from "./routes/domains";
import { healthRoutes } from "./routes/health";
import { startCleanupJob } from "./jobs/cleanup";

const app = new Hono();

// Middleware
app.use(logger());
app.use("*", requestId());
app.use(
  "*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Routes
app.route("/api/v1", healthRoutes);
app.route("/api/v1", domainRoutes);
app.route("/api/v1", inboxRoutes);
app.route("/api/v1", emailRoutes);

// Root
app.get("/", (c) => c.text("mailuse API"));

// Start background jobs
startCleanupJob();

export default {
  port: env.PORT,
  fetch: app.fetch,
};
