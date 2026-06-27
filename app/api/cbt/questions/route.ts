import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const examType = searchParams.get("examType");
  const subject = searchParams.get("subject");

  if (!examType || !subject) {
    return NextResponse.json({ error: "examType and subject are required" }, { status: 400 });
  }

  const questions = await prisma.question.findMany({
    where: { examType: examType as never, subject },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ questions });
}
