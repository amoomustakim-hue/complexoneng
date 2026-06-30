import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { scoreQuiz, CAREER_INFO, type CareerCategory } from "@/lib/career-quiz";
import { getCareerCounsellorModel } from "@/lib/gemini";

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
    data: { profileId: profile.id, answers, topMatches },
  });

  // Generate personalised AI explanation
  let aiExplanation = "";
  try {
    const model = getCareerCounsellorModel();
    const topLabels = topMatches.map((m) => CAREER_INFO[m.category].label).join(", ");
    const answerSummary = answers
      .map((a, i) => `Q${i + 1}: chose ${CAREER_INFO[a]?.label ?? a}`)
      .join("; ");
    const prompt =
      `Student quiz answers: ${answerSummary}.\n` +
      `Top career matches: ${topLabels}.\n` +
      "Write a 2-paragraph personalised explanation of why these careers suit this student.";
    const geminiResult = await model.generateContent(prompt);
    aiExplanation = geminiResult.response.text();
  } catch {
    // AI explanation is best-effort — scoring still returns successfully
  }

  return NextResponse.json({ result, topMatches, aiExplanation });
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
