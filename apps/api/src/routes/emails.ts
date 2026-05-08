import { Hono } from "hono";
import { EmailService } from "../services/email.service";

export const emailRoutes = new Hono();

// List emails in inbox
emailRoutes.get("/inboxes/:address/emails", async (c) => {
  const address = c.req.param("address");
  const page = Number(c.req.query("page") || "1");
  const limit = Math.min(Number(c.req.query("limit") || "50"), 100);

  const result = await EmailService.listByInbox(address, { page, limit });

  if (!result) {
    return c.json({ error: "Inbox not found" }, 404);
  }

  return c.json(result);
});

// Get email detail
emailRoutes.get("/inboxes/:address/emails/:emailId", async (c) => {
  const address = c.req.param("address");
  const emailId = c.req.param("emailId");

  const email = await EmailService.getById(address, emailId);

  if (!email) {
    return c.json({ error: "Email not found" }, 404);
  }

  return c.json(email);
});

// Delete email
emailRoutes.delete("/inboxes/:address/emails/:emailId", async (c) => {
  const address = c.req.param("address");
  const emailId = c.req.param("emailId");

  const deleted = await EmailService.delete(address, emailId);

  if (!deleted) {
    return c.json({ error: "Email not found" }, 404);
  }

  return c.json({ success: true });
});

// Download attachment
emailRoutes.get(
  "/inboxes/:address/emails/:emailId/attachments/:attachmentId",
  async (c) => {
    const { address, emailId, attachmentId } = c.req.param();

    const attachment = await EmailService.getAttachment(address, emailId, attachmentId);

    if (!attachment) {
      return c.json({ error: "Attachment not found" }, 404);
    }

    c.header("Content-Type", attachment.contentType);
    c.header("Content-Disposition", `attachment; filename="${attachment.filename}"`);
    return c.body(attachment.stream);
  }
);
