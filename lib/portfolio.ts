import { prisma } from "@/lib/prisma";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 40);
}

export async function getOrCreatePortfolioSlug(profileId: string, fullName: string | null, email: string) {
  const existing = await prisma.profile.findUnique({ where: { id: profileId } });
  if (existing?.portfolioSlug) return existing.portfolioSlug;

  const base = slugify(fullName || email.split("@")[0]) || "student";
  let slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;

  while (await prisma.profile.findUnique({ where: { portfolioSlug: slug } })) {
    slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  }

  await prisma.profile.update({ where: { id: profileId }, data: { portfolioSlug: slug } });
  return slug;
}
