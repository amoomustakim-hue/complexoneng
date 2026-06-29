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
  const { score, total, answers, questionsUsed } = (await req.json()) as {
    score?: number;
    total?: number;
    answers?: Record<string, string>;
    questionsUsed?: unknown;
  };

  if (typeof score !== "number" || typeof total !== "number") {
    return NextResponse.json({ error: "score and total are required" }, { status: 400 });
  }

  const attempt = await prisma.moduleQuizAttempt.create({
    data: {
      profileId: profile.id,
      moduleId: id,
      score,
      total,
      answers: answers ?? {},
      questionsUsed: questionsUsed ? (questionsUsed as never) : undefined,
    },
  });

  return NextResponse.json({ attempt });
}
