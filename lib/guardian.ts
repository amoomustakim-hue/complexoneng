import { prisma } from "@/lib/prisma";

function randomSlug() {
  return Math.random().toString(36).slice(2, 10);
}

export async function getOrCreateGuardianSlug(profileId: string) {
  const existing = await prisma.profile.findUnique({ where: { id: profileId } });
  if (existing?.guardianSlug) return existing.guardianSlug;

  let slug = randomSlug();
  while (await prisma.profile.findUnique({ where: { guardianSlug: slug } })) {
    slug = randomSlug();
  }

  await prisma.profile.update({ where: { id: profileId }, data: { guardianSlug: slug } });
  return slug;
}
