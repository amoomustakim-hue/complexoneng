import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateProfile } from "@/lib/profile";

const VALID_LEVELS = ["SS1", "SS2", "SS3", "JAMB", "L100", "L200", "L300", "L400", "POSTGRAD"];
const VALID_EXAMS = ["JAMB", "WAEC", "NECO", "POST_UTME"];

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { level, school, targetExam } = body as {
    level?: string;
    school?: string;
    targetExam?: string;
  };

  if (!level || !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }
  if (!targetExam || !VALID_EXAMS.includes(targetExam)) {
    return NextResponse.json({ error: "Invalid target exam" }, { status: 400 });
  }

  await getOrCreateProfile();

  const profile = await prisma.profile.update({
    where: { clerkUserId: userId },
    data: {
      level: level as never,
      school: school?.trim() || null,
      targetExam: targetExam as never,
      onboarded: true,
    },
  });

  return NextResponse.json({ profile });
}
