import { prisma } from "@/lib/prisma";

export async function getOrCreateCoachSession(profileId: string) {
  const existing = await prisma.coachSession.findFirst({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });
  if (existing) return existing;

  return prisma.coachSession.create({ data: { profileId, messages: [] } });
}
