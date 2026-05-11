import prisma from "@mailuse/db";
import { generateId } from "@mailuse/shared/id";
import { env } from "@mailuse/env/server";
import type { CreateInboxInput } from "@mailuse/shared/schemas";

export class InboxService {
  static async create(input: CreateInboxInput) {
    const localPart = input.localPart || this.generateLocalPart();
    const domain = input.domain || env.DOMAIN || env.APP_DOMAIN;
    const address = `${localPart}@${domain}`;
    const ttlMinutes = input.ttlMinutes || Math.ceil(env.EMAIL_TTL_SECONDS / 60);

    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

    const inbox = await prisma.inbox.create({
      data: {
        id: generateId("inb"),
        address,
        localPart,
        domain,
        expiresAt,
      },
    });

    return {
      id: inbox.id,
      address: inbox.address,
      localPart: inbox.localPart,
      domain: inbox.domain,
      expiresAt: inbox.expiresAt.toISOString(),
      createdAt: inbox.createdAt.toISOString(),
    };
  }

  static async getByAddress(address: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return null;

    // Check if expired
    if (inbox.expiresAt && inbox.expiresAt < new Date()) {
      return null;
    }

    return {
      id: inbox.id,
      address: inbox.address,
      localPart: inbox.localPart,
      domain: inbox.domain,
      expiresAt: inbox.expiresAt?.toISOString() ?? null,
      createdAt: inbox.createdAt.toISOString(),
      lastEmailAt: inbox.lastEmailAt?.toISOString() ?? null,
    };
  }

  static async delete(address: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address },
    });

    if (!inbox) return false;

    await prisma.inbox.update({
      where: { address },
      data: { isDeleted: true },
    });

    return true;
  }

  static async clear(address: string) {
    const inbox = await prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });

    if (!inbox) return null;

    const result = await prisma.email.deleteMany({
      where: { inboxId: inbox.id },
    });

    return result.count;
  }

  static async findByAddress(address: string) {
    return prisma.inbox.findUnique({
      where: { address, isDeleted: false },
    });
  }

  static async updateLastEmailAt(address: string) {
    await prisma.inbox.update({
      where: { address },
      data: { lastEmailAt: new Date() },
    });
  }

  static async cleanupExpired() {
    const now = new Date();

    // Delete emails belonging to expired inboxes
    await prisma.email.deleteMany({
      where: {
        inbox: {
          OR: [
            { expiresAt: { lt: now } },
            { isDeleted: true },
          ],
        },
      },
    });

    // Delete expired inboxes
    await prisma.inbox.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: now } },
          { isDeleted: true },
        ],
      },
    });
  }

  private static generateLocalPart(): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
