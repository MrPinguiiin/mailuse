import { Hono } from "hono";
import { EmailService } from "../services/email.service";
import { InboxService } from "../services/inbox.service";

export const compatibilityRoutes = new Hono();

compatibilityRoutes.get("/inbox/:address", async (c) => {
  const address = c.req.param("address");
  const page = Number(c.req.query("page") || "1");
  const limit = Math.min(Number(c.req.query("limit") || "10"), 50);

  const result = await EmailService.listByInbox(address, { page, limit });

  if (!result) {
    return c.json({ error: "Inbox not found" }, 404);
  }

  return c.json({
    emails: result.emails.map(EmailService.toMailuseEmail),
    pagination: {
      ...result.pagination,
      hasMore: result.pagination.page < result.pagination.totalPages,
    },
  });
});

compatibilityRoutes.delete("/inbox/:address", async (c) => {
  const address = c.req.param("address");
  const deleted = await InboxService.clear(address);

  if (deleted === null) {
    return c.json({ error: "Inbox not found" }, 404);
  }

  return c.json({ deleted });
});

compatibilityRoutes.get("/email/:id", async (c) => {
  const email = await EmailService.getByIdOnly(c.req.param("id"));

  if (!email) {
    return c.json({ error: "Email not found" }, 404);
  }

  return c.json(EmailService.toMailuseEmail(email));
});

compatibilityRoutes.delete("/email/:id", async (c) => {
  const deleted = await EmailService.deleteByIdOnly(c.req.param("id"));

  if (!deleted) {
    return c.json({ error: "Email not found" }, 404);
  }

  return c.json({ deleted: true });
});
