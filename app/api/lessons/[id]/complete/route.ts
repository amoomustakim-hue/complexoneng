import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { awardActivity } from "@/lib/gamification";

const POINTS_PER_LESSON = 10;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const existing = await prisma.lessonProgress.findUnique({
    where: { profileId_lessonId: { profileId: profile.id, lessonId: id } },
  });

  if (!existing) {
    await prisma.lessonProgress.create({ data: { profileId: profile.id, lessonId: id } });
    await awardActivity(profile.id, POINTS_PER_LESSON);
  }

  return NextResponse.json({ completed: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;
  await prisma.lessonProgress.deleteMany({ where: { profileId: profile.id, lessonId: id } });

  return NextResponse.json({ completed: false });
}
