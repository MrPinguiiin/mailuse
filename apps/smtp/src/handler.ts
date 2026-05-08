import { simpleParser } from "mailparser";
import type { SMTPServerSession } from "smtp-server";
import type { Readable } from "stream";
import prisma from "@mailuse/db";
import { generateId } from "@mailuse/shared/id";
import { env } from "@mailuse/env/server";
import { uploadAttachment } from "./storage";
import { createLogger } from "./logger";

const logger = createLogger("handler");

export async function handleMessage(stream: Readable, session: SMTPServerSession) {
  // Collect raw data
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  const rawBuffer = Buffer.concat(chunks);
  const rawSize = rawBuffer.length;

  // Parse MIME
  const parsed = await simpleParser(rawBuffer);

  const toAddresses = Array.isArray(parsed.to)
    ? parsed.to.flatMap((t) => ("value" in t ? t.value.map((v) => v.address) : []))
    : parsed.to?.value.map((v) => v.address) || [];

  const fromAddress =
    parsed.from?.value[0]?.address || session.envelope.mailFrom?.address || "unknown@unknown";

  const messageId = parsed.messageId || `${generateId("eml")}@${env.APP_DOMAIN}`;
  const subject = parsed.subject || "(no subject)";
  const textBody = parsed.text || null;
  const htmlBody = parsed.html || null;

  logger.info(
    { from: fromAddress, to: toAddresses, subject, size: rawSize },
    "Processing email"
  );

  for (const toAddress of toAddresses) {
    if (!toAddress) continue;

    const domain = toAddress.split("@")[1];
    const allowedDomain = env.SMTP_DOMAIN || env.APP_DOMAIN;

    if (domain !== allowedDomain) {
      logger.warn({ toAddress, domain }, "Skipping: domain not served");
      continue;
    }

    // Find or auto-create inbox
    let inbox = await prisma.inbox.findUnique({
      where: { address: toAddress, isDeleted: false },
    });

    if (!inbox && env.AUTO_CREATE_INBOX) {
      const localPart = toAddress.split("@")[0]!;
      inbox = await prisma.inbox.create({
        data: {
          id: generateId("inb"),
          address: toAddress,
          localPart,
          domain,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour default
        },
      });
      logger.info({ address: toAddress }, "Auto-created inbox");
    }

    if (!inbox) {
      logger.warn({ toAddress }, "Inbox not found, skipping");
      continue;
    }

    // Check if inbox is expired
    if (inbox.expiresAt && inbox.expiresAt < new Date()) {
      logger.warn({ address: toAddress }, "Inbox expired, skipping");
      continue;
    }

    // Check for duplicate message_id
    const existing = await prisma.email.findFirst({
      where: { messageId, inboxId: inbox.id },
    });

    if (existing) {
      logger.info({ messageId }, "Duplicate message, skipping");
      continue;
    }

    // Process attachments
    const attachmentRecords: Array<{
      id: string;
      filename: string;
      contentType: string;
      size: number;
      storageKey: string;
    }> = [];

    if (parsed.attachments && parsed.attachments.length > 0) {
      for (const att of parsed.attachments) {
        const attId = generateId("att");
        const emailId = generateId("eml"); // pre-generate for path
        const storageKey = `${inbox.id}/${emailId}/${attId}/${att.filename || "unnamed"}`;

        await uploadAttachment(storageKey, att.content, att.contentType);

        attachmentRecords.push({
          id: attId,
          filename: att.filename || "unnamed",
          contentType: att.contentType,
          size: att.size,
          storageKey,
        });
      }
    }

    // Store email
    const emailId = generateId("eml");
    await prisma.email.create({
      data: {
        id: emailId,
        inboxId: inbox.id,
        messageId,
        fromAddress,
        toAddress,
        subject,
        textBody,
        htmlBody,
        rawSize,
        hasAttachments: attachmentRecords.length > 0,
        attachments: {
          create: attachmentRecords,
        },
      },
    });

    // Update inbox last email timestamp
    await prisma.inbox.update({
      where: { id: inbox.id },
      data: { lastEmailAt: new Date() },
    });

    logger.info({ emailId, inbox: toAddress }, "Email stored successfully");
  }
}
