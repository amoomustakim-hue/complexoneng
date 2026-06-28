import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;
  const community = await prisma.community.findUnique({ where: { id } });
  if (!community) {
    return NextResponse.json({ error: "Community not found" }, { status: 404 });
  }

  await prisma.communityMembership.upsert({
    where: { communityId_profileId: { communityId: id, profileId: profile.id } },
    create: { communityId: id, profileId: profile.id },
    update: {},
  });

  return NextResponse.json({ joined: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;

  await prisma.communityMembership.deleteMany({
    where: { communityId: id, profileId: profile.id },
  });

  return NextResponse.json({ joined: false });
}
