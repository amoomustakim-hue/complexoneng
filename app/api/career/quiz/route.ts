import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { scoreQuiz, type CareerCategory } from "@/lib/career-quiz";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { answers } = (await req.json()) as { answers: CareerCategory[] };
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "Answers are required" }, { status: 400 });
  }

  const topMatches = scoreQuiz(answers).slice(0, 3);

  const result = await prisma.careerResult.create({
    data: {
      profileId: profile.id,
      answers,
      topMatches,
    },
  });

  return NextResponse.json({ result, topMatches });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ result: null });
  }

  const result = await prisma.careerResult.findFirst({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ result });
}
