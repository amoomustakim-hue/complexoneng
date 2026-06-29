import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id: lessonId } = await params;
  const { content } = (await req.json()) as { content?: string };

  const note = await prisma.lessonNote.upsert({
    where: { profileId_lessonId: { profileId: profile.id, lessonId } },
    create: { profileId: profile.id, lessonId, content: content ?? "" },
    update: { content: content ?? "" },
  });

  return NextResponse.json({ note });
}
