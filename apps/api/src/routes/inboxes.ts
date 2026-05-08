import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createInboxSchema } from "@mailuse/shared/schemas";
import { InboxService } from "../services/inbox.service";

export const inboxRoutes = new Hono();

// Create inbox
inboxRoutes.post("/inboxes", zValidator("json", createInboxSchema), async (c) => {
  const body = c.req.valid("json");
  const inbox = await InboxService.create(body);
  return c.json(inbox, 201);
});

// Get inbox by address
inboxRoutes.get("/inboxes/:address", async (c) => {
  const address = c.req.param("address");
  const inbox = await InboxService.getByAddress(address);

  if (!inbox) {
    return c.json({ error: "Inbox not found" }, 404);
  }

  return c.json(inbox);
});

// Delete inbox
inboxRoutes.delete("/inboxes/:address", async (c) => {
  const address = c.req.param("address");
  const deleted = await InboxService.delete(address);

  if (!deleted) {
    return c.json({ error: "Inbox not found" }, 404);
  }

  return c.json({ success: true });
});
