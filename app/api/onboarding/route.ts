import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateProfile } from "@/lib/profile";

const VALID_TRACKS = ["HIGH_SCHOOL", "UNDERGRAD", "RESEARCHER"];
const VALID_LEVELS = ["SS1", "SS2", "SS3", "JAMB", "L100", "L200", "L300", "L400", "POSTGRAD"];
const VALID_EXAMS = ["JAMB", "WAEC", "NECO", "POST_UTME"];

type OnboardingBody = {
  fullName?: string;
  dateOfBirth?: string | null;
  avatarUrl?: string | null;
  track?: string;
  level?: string;
  school?: string;
  targetExam?: string;
  courseOfStudy?: string;
  researchArea?: string;
  researchStage?: string;
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as OnboardingBody;
  const {
    fullName,
    dateOfBirth,
    avatarUrl,
    track,
    level,
    school,
    targetExam,
    courseOfStudy,
    researchArea,
    researchStage,
  } = body;

  if (!track || !VALID_TRACKS.includes(track)) {
    return NextResponse.json({ error: "Invalid track" }, { status: 400 });
  }
  if (!level || !VALID_LEVELS.includes(level)) {
    return NextResponse.json({ error: "Invalid level" }, { status: 400 });
  }

  if (track === "HIGH_SCHOOL" && (!targetExam || !VALID_EXAMS.includes(targetExam))) {
    return NextResponse.json({ error: "Target exam is required" }, { status: 400 });
  }
  if (track === "RESEARCHER" && !researchArea?.trim()) {
    return NextResponse.json({ error: "Research area is required" }, { status: 400 });
  }

  await getOrCreateProfile();

  const profile = await prisma.profile.update({
    where: { clerkUserId: userId },
    data: {
      fullName: fullName?.trim() || undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      avatarUrl: avatarUrl ?? null,
      track: track as never,
      level: level as never,
      school: school?.trim() || null,
      targetExam: track === "HIGH_SCHOOL" ? (targetExam as never) : null,
      courseOfStudy: (track === "UNDERGRAD" || (track === "HIGH_SCHOOL" && level === "JAMB")) ? courseOfStudy?.trim() || null : null,
      researchArea: track === "RESEARCHER" ? researchArea?.trim() || null : null,
      researchStage: track === "RESEARCHER" ? researchStage?.trim() || null : null,
      onboarded: true,
    },
  });

  return NextResponse.json({ profile });
}
