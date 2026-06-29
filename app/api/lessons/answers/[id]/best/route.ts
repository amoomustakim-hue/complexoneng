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

  const { id: answerId } = await params;
  const answer = await prisma.lessonAnswer.findUnique({
    where: { id: answerId },
    include: { question: true },
  });

  if (!answer) {
    return NextResponse.json({ error: "Answer not found" }, { status: 404 });
  }
  if (answer.question.profileId !== profile.id) {
    return NextResponse.json(
      { error: "Only the person who asked can mark a best answer" },
      { status: 403 }
    );
  }

  await prisma.$transaction([
    prisma.lessonAnswer.updateMany({
      where: { questionId: answer.questionId },
      data: { isBest: false },
    }),
    prisma.lessonAnswer.update({ where: { id: answerId }, data: { isBest: true } }),
  ]);

  return NextResponse.json({ marked: true });
}
