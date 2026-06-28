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
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  await prisma.enrollment.upsert({
    where: { profileId_courseId: { profileId: profile.id, courseId: id } },
    create: { profileId: profile.id, courseId: id },
    update: {},
  });

  return NextResponse.json({ enrolled: true });
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
  await prisma.enrollment.deleteMany({ where: { profileId: profile.id, courseId: id } });

  return NextResponse.json({ enrolled: false });
}
