import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { awardActivity } from "@/lib/gamification";

const QUIZ_BASE_POINTS = 20;
const QUIZ_POINTS_PER_CORRECT = 5;

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
  const { score, total, answers } = (await req.json()) as {
    score?: number;
    total?: number;
    answers?: Record<string, string>;
  };

  if (typeof score !== "number" || typeof total !== "number") {
    return NextResponse.json({ error: "score and total are required" }, { status: 400 });
  }

  const isFirstAttempt =
    (await prisma.moduleQuizAttempt.count({ where: { profileId: profile.id, moduleId: id } })) === 0;

  const attempt = await prisma.moduleQuizAttempt.create({
    data: {
      profileId: profile.id,
      moduleId: id,
      score,
      total,
      answers: answers ?? {},
    },
  });

  if (isFirstAttempt) {
    await awardActivity(profile.id, QUIZ_BASE_POINTS + score * QUIZ_POINTS_PER_CORRECT);
  }

  return NextResponse.json({ attempt });
}
