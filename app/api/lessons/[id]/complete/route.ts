import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

  await prisma.lessonProgress.upsert({
    where: { profileId_lessonId: { profileId: profile.id, lessonId: id } },
    create: { profileId: profile.id, lessonId: id },
    update: {},
  });

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
