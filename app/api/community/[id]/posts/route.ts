import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;

  const membership = await prisma.communityMembership.findUnique({
    where: { communityId_profileId: { communityId: id, profileId: profile.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Join the community to post" }, { status: 403 });
  }

  const { content } = (await req.json()) as { content?: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  const post = await prisma.communityPost.create({
    data: { communityId: id, profileId: profile.id, content: content.trim() },
    include: { profile: true },
  });

  return NextResponse.json({ post });
}
