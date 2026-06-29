import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id: courseId } = await params;
  const { rating, comment } = (await req.json()) as { rating?: number; comment?: string };

  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const review = await prisma.courseReview.upsert({
    where: { profileId_courseId: { profileId: profile.id, courseId } },
    create: { profileId: profile.id, courseId, rating, comment: comment?.trim() || null },
    update: { rating, comment: comment?.trim() || null },
  });

  return NextResponse.json({ review });
}
