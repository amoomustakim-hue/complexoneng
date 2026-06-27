import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ open: [], mine: [] });
  }

  const [open, mine] = await Promise.all([
    prisma.researchRequest.findMany({
      where: { status: "OPEN", profileId: { not: profile.id } },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { offers: true } } },
    }),
    prisma.researchRequest.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        offers: { orderBy: { createdAt: "desc" }, include: { profile: true } },
      },
    }),
  ]);

  return NextResponse.json({ open, mine });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { title, description, skillsNeeded, budget } = body as {
    title?: string;
    description?: string;
    skillsNeeded?: string;
    budget?: string;
  };

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
  }

  const request_ = await prisma.researchRequest.create({
    data: {
      profileId: profile.id,
      title: title.trim(),
      description: description.trim(),
      skillsNeeded: skillsNeeded?.trim() || null,
      budget: budget?.trim() || null,
    },
  });

  return NextResponse.json({ request: request_ });
}
