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

  const { id: lessonId } = await params;
  const { content } = (await req.json()) as { content?: string };

  if (!content?.trim()) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  const question = await prisma.lessonQuestion.create({
    data: { lessonId, profileId: profile.id, content: content.trim() },
    include: { profile: true, answers: { include: { profile: true } } },
  });

  return NextResponse.json({ question });
}
