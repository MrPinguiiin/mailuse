import { z } from "zod";

export const createInboxSchema = z.object({
  localPart: z
    .string()
    .min(3)
    .max(64)
    .regex(/^[a-z0-9][a-z0-9._-]*[a-z0-9]$/, "Invalid local part format")
    .optional(),
  domain: z.string().optional(),
  ttlMinutes: z.number().int().min(5).max(10080).default(60), // 5 min to 7 days
});

export type CreateInboxInput = z.infer<typeof createInboxSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
