import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { examType, subject, year, question, options, answer, explanation } = body as {
    examType?: string;
    subject?: string;
    year?: number;
    question?: string;
    options?: string[];
    answer?: string;
    explanation?: string;
  };

  if (
    !examType ||
    !subject?.trim() ||
    !question?.trim() ||
    !Array.isArray(options) ||
    options.filter((o) => o?.trim()).length < 2 ||
    !answer?.trim()
  ) {
    return NextResponse.json(
      { error: "Exam type, subject, question, at least 2 options, and answer are required" },
      { status: 400 }
    );
  }

  const created = await prisma.question.create({
    data: {
      examType: examType as never,
      subject: subject.trim(),
      year: year || null,
      question: question.trim(),
      options: options.filter((o) => o?.trim()),
      answer: answer.trim(),
      explanation: explanation?.trim() || null,
    },
  });

  return NextResponse.json({ question: created });
}
