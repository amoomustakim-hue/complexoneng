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

  const { id: questionId } = await params;
  const question = await prisma.lessonQuestion.findUnique({ where: { id: questionId } });
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  const { content } = (await req.json()) as { content?: string };
  if (!content?.trim()) {
    return NextResponse.json({ error: "Answer is required" }, { status: 400 });
  }

  const answer = await prisma.lessonAnswer.create({
    data: { questionId, profileId: profile.id, content: content.trim() },
    include: { profile: true },
  });

  return NextResponse.json({ answer });
}
