import prisma from "@mailuse/db";

export class DomainService {
  static async listActive() {
    const domains = await prisma.domain.findMany({
      where: { isActive: true },
      select: {
        id: true,
        domain: true,
        providerType: true,
      },
    });

    return domains;
  }

  static async exists(domain: string) {
    const record = await prisma.domain.findUnique({
      where: { domain, isActive: true },
    });
    return !!record;
  }
}
