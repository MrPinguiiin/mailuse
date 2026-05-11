import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_API_URL: z.string().optional(),
    PUBLIC_APP_NAME: z.string().default("mailuse"),
    PUBLIC_EMAIL_DOMAIN: z.string().optional(),
    PUBLIC_API_BASE: z.string().default("http://localhost:3000"),
    PUBLIC_APP_DOMAIN: z.string().default("localhost"),
  },
  runtimeEnv: (import.meta as any).env,
  emptyStringAsUndefined: true,
});
