import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { mentorBio, mentorExpertise } = (await req.json()) as {
    mentorBio?: string;
    mentorExpertise?: string;
  };

  if (!mentorBio?.trim() || !mentorExpertise?.trim()) {
    return NextResponse.json({ error: "Bio and expertise are required" }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { clerkUserId: userId },
    data: {
      isMentor: true,
      mentorBio: mentorBio.trim(),
      mentorExpertise: mentorExpertise.trim(),
    },
  });

  return NextResponse.json({ profile });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.profile.update({
    where: { clerkUserId: userId },
    data: { isMentor: false },
  });

  return NextResponse.json({ isMentor: false });
}
