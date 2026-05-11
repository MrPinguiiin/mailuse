import prisma from "@mailuse/db";
import { generateId } from "@mailuse/shared/id";
import { StorageService } from "./storage.service";

interface StoreEmailInput {
  inboxId: string;
  messageId: string;
  fromAddress: string;
  toAddress: string;
  subject: string;
  textBody?: string;
  htmlBody?: string;
  headers?: Record<string, string>;
  rawSize: number;
  attachments?: Array<{
    filename: string;
    contentType: string;
    size: number;
    content: Buffer;
  }>;
}

export class EmailService {
  static async listByInbox(address: string, opts: { page: number; limit: number }) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return null;

    const skip = (opts.page - 1) * opts.limit;

    const [emails, total] = await Promise.all([
      prisma.email.findMany({
        where: { inboxId: inbox.id },
        orderBy: { receivedAt: "desc" },
        skip,
        take: opts.limit,
        select: {
          id: true,
          messageId: true,
          fromAddress: true,
          subject: true,
          textBody: true,
          htmlBody: true,
          headers: true,
          receivedAt: true,
          rawSize: true,
          hasAttachments: true,
        },
      }),
      prisma.email.count({ where: { inboxId: inbox.id } }),
    ]);

    return {
      emails: emails.map((e) => ({
        ...e,
        receivedAt: e.receivedAt.toISOString(),
      })),
      pagination: {
        page: opts.page,
        limit: opts.limit,
        total,
        totalPages: Math.ceil(total / opts.limit),
      },
    };
  }

  static async getById(address: string, emailId: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return null;

    const email = await prisma.email.findFirst({
      where: { id: emailId, inboxId: inbox.id },
      include: {
        attachments: {
          select: {
            id: true,
            filename: true,
            contentType: true,
            size: true,
          },
        },
      },
    });

    if (!email) return null;

    return {
      id: email.id,
      messageId: email.messageId,
      fromAddress: email.fromAddress,
      toAddress: email.toAddress,
      subject: email.subject,
      textBody: email.textBody,
      htmlBody: email.htmlBody,
      headers: email.headers,
      rawSize: email.rawSize,
      receivedAt: email.receivedAt.toISOString(),
      hasAttachments: email.hasAttachments,
      attachments: email.attachments,
    };
  }

  static async delete(address: string, emailId: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return false;

    const email = await prisma.email.findFirst({
      where: { id: emailId, inboxId: inbox.id },
      include: { attachments: true },
    });

    if (!email) return false;

    // Delete attachments from storage
    for (const att of email.attachments) {
      await StorageService.delete(att.storageKey);
    }

    await prisma.email.delete({ where: { id: emailId } });
    return true;
  }

  static async store(input: StoreEmailInput) {
    const emailId = generateId("eml");

    const attachmentRecords = [];

    if (input.attachments && input.attachments.length > 0) {
      for (const att of input.attachments) {
        const attId = generateId("att");
        const storageKey = `${input.inboxId}/${emailId}/${attId}/${att.filename}`;

        await StorageService.upload(storageKey, att.content, att.contentType);

        attachmentRecords.push({
          id: attId,
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
          storageKey,
        });
      }
    }

    const email = await prisma.email.create({
      data: {
        id: emailId,
        inboxId: input.inboxId,
        messageId: input.messageId,
        fromAddress: input.fromAddress,
        toAddress: input.toAddress,
        subject: input.subject,
        textBody: input.textBody,
        htmlBody: input.htmlBody,
        headers: input.headers,
        rawSize: input.rawSize,
        hasAttachments: attachmentRecords.length > 0,
        attachments: {
          create: attachmentRecords,
        },
      },
    });

    return email;
  }

  static async getAttachment(address: string, emailId: string, attachmentId: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return null;

    const attachment = await prisma.attachment.findFirst({
      where: {
        id: attachmentId,
        email: {
          id: emailId,
          inboxId: inbox.id,
        },
      },
    });

    if (!attachment) return null;

    const stream = await StorageService.download(attachment.storageKey);

    return {
      filename: attachment.filename,
      contentType: attachment.contentType,
      size: attachment.size,
      stream,
    };
  }

  static async getByIdOnly(emailId: string) {
    const email = await prisma.email.findUnique({
      where: { id: emailId },
      include: {
        attachments: {
          select: {
            id: true,
            filename: true,
            contentType: true,
            size: true,
          },
        },
      },
    });

    if (!email) return null;

    return {
      id: email.id,
      messageId: email.messageId,
      fromAddress: email.fromAddress,
      toAddress: email.toAddress,
      subject: email.subject,
      textBody: email.textBody,
      htmlBody: email.htmlBody,
      headers: email.headers,
      rawSize: email.rawSize,
      receivedAt: email.receivedAt.toISOString(),
      hasAttachments: email.hasAttachments,
      attachments: email.attachments,
    };
  }

  static async deleteByIdOnly(emailId: string) {
    const email = await prisma.email.findUnique({
      where: { id: emailId },
      include: { attachments: true },
    });

    if (!email) return false;

    for (const att of email.attachments) {
      await StorageService.delete(att.storageKey);
    }

    await prisma.email.delete({ where: { id: emailId } });
    return true;
  }

  static toMailuseEmail(email: any) {
    return {
      id: email.id,
      to: email.toAddress,
      from: email.fromAddress,
      subject: email.subject,
      text: email.textBody || "",
      html: email.htmlBody || "",
      headers: email.headers || {},
      receivedAt: email.receivedAt,
    };
  }
}
