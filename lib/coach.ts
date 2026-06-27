import { prisma } from "@/lib/prisma";

export async function getOrCreateCoachSession(profileId: string, context: string = "academic") {
  const existing = await prisma.coachSession.findFirst({
    where: { profileId, context },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  return prisma.coachSession.create({ data: { profileId, context, messages: [] } });
}
