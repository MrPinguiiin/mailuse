import { Hono } from "hono";
import { DomainService } from "../services/domain.service";

export const domainRoutes = new Hono();

domainRoutes.get("/domains", async (c) => {
  const domains = await DomainService.listActive();
  return c.json({ domains });
});
