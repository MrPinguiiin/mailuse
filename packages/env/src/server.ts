import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Database
    DATABASE_URL: z.string().min(1),

    // App
    APP_DOMAIN: z.string().min(1).default("localhost"),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    CORS_ORIGIN: z.string().default("http://localhost:5173"),

    // Storage (S3/MinIO/R2)
    STORAGE_ENDPOINT: z.string().default("http://localhost:9000"),
    STORAGE_BUCKET: z.string().default("emails"),
    STORAGE_ACCESS_KEY: z.string().default("minio"),
    STORAGE_SECRET_KEY: z.string().default("miniosecret"),
    STORAGE_REGION: z.string().default("auto"),

    // SMTP
    SMTP_DOMAIN: z.string().optional(),
    SMTP_PORT: z.coerce.number().default(25),

    // Deploy mode
    DEPLOY_MODE: z.enum(["docker", "cloudflare"]).default("docker"),

    // Optional: auto-create inbox on first email receive
    AUTO_CREATE_INBOX: z.coerce.boolean().default(true),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
