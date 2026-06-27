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
    return NextResponse.json({ sessions: [] });
  }

  const sessions = await prisma.cbtSession.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ sessions });
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
  const { examType, subject, score, total, answers, startedAt } = body as {
    examType: string;
    subject: string;
    score: number;
    total: number;
    answers: Record<string, string>;
    startedAt: string;
  };

  const session = await prisma.cbtSession.create({
    data: {
      profileId: profile.id,
      examType: examType as never,
      subject,
      score,
      total,
      answers,
      startedAt: new Date(startedAt),
      completedAt: new Date(),
    },
  });

  return NextResponse.json({ session });
}
