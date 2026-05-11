/**
 * Cloudflare Email Worker
 *
 * Handles inbound email via Cloudflare Email Routing.
 * Parses MIME, stores metadata in D1, body/attachments in R2.
 */

export interface Env {
  DB: D1Database;
  STORAGE: R2Bucket;
  APP_DOMAIN: string;
  AUTO_CREATE_INBOX: string;
}

export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {
    const toAddress = message.to;
    const fromAddress = message.from;
    const domain = toAddress.split("@")[1];

    if (domain !== env.APP_DOMAIN) {
      message.setReject("Domain not served");
      return;
    }

    // Read raw email
    const rawEmail = await new Response(message.raw).arrayBuffer();
    const rawSize = rawEmail.byteLength;

    // Extract headers for subject and message-id
    const subject = message.headers.get("subject") || "(no subject)";
    const messageId = message.headers.get("message-id") || `eml_${crypto.randomUUID()}@${env.APP_DOMAIN}`;
    const headers = JSON.stringify(Object.fromEntries(message.headers.entries()));

    // Check if inbox exists
    const localPart = toAddress.split("@")[0];
    let inbox = await env.DB.prepare(
      "SELECT id, expires_at FROM inboxes WHERE address = ? AND is_deleted = 0"
    )
      .bind(toAddress)
      .first<{ id: string; expires_at: string | null }>();

    if (!inbox && env.AUTO_CREATE_INBOX === "true") {
      const inboxId = `inb_${crypto.randomUUID()}`;
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      await env.DB.prepare(
        "INSERT INTO inboxes (id, address, local_part, domain, expires_at, created_at, is_deleted) VALUES (?, ?, ?, ?, ?, ?, 0)"
      )
        .bind(inboxId, toAddress, localPart, domain, expiresAt, new Date().toISOString())
        .run();

      inbox = { id: inboxId, expires_at: expiresAt };
    }

    if (!inbox) {
      message.setReject("Inbox not found");
      return;
    }

    // Check expiry
    if (inbox.expires_at && new Date(inbox.expires_at) < new Date()) {
      message.setReject("Inbox expired");
      return;
    }

    // Store raw email in R2
    const emailId = `eml_${crypto.randomUUID()}`;
    const storageKey = `${inbox.id}/${emailId}/raw.eml`;
    await env.STORAGE.put(storageKey, rawEmail);

    // Store metadata in D1
    await env.DB.prepare(
      `INSERT INTO emails (id, inbox_id, message_id, from_address, to_address, subject, headers, raw_size, received_at, has_attachments)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
    )
      .bind(emailId, inbox.id, messageId, fromAddress, toAddress, subject, headers, rawSize, new Date().toISOString())
      .run();

    // Update inbox last_email_at
    await env.DB.prepare("UPDATE inboxes SET last_email_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), inbox.id)
      .run();
  },
};
