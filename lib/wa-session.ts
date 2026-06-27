import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type WaContext = Record<string, unknown>;

export async function getOrCreateWaSession(phone: string) {
  const existing = await prisma.waSession.findUnique({ where: { phone } });
  if (existing) return existing;

  return prisma.waSession.create({ data: { phone, state: "idle", context: {} } });
}

export async function setWaSession(phone: string, state: string, context: WaContext = {}) {
  return prisma.waSession.update({
    where: { phone },
    data: { state, context: context as Prisma.InputJsonValue },
  });
}
