import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreatePortfolioSlug } from "@/lib/portfolio";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { isPublic } = (await req.json()) as { isPublic: boolean };

  if (isPublic) {
    await getOrCreatePortfolioSlug(profile.id, profile.fullName, profile.email);
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: { portfolioPublic: isPublic },
  });

  return NextResponse.json({ portfolioPublic: updated.portfolioPublic, portfolioSlug: updated.portfolioSlug });
}
