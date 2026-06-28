import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ mentorId: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { mentorId } = await params;
  const mentor = await prisma.profile.findUnique({ where: { id: mentorId } });
  if (!mentor || !mentor.isMentor) {
    return NextResponse.json({ error: "Mentor not found" }, { status: 404 });
  }
  if (mentor.id === profile.id) {
    return NextResponse.json({ error: "You can't request a session with yourself" }, { status: 400 });
  }

  const { message, preferredTopic } = (await req.json()) as {
    message?: string;
    preferredTopic?: string;
  };

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const request_ = await prisma.mentorshipRequest.create({
    data: {
      mentorId: mentor.id,
      studentId: profile.id,
      message: message.trim(),
      preferredTopic: preferredTopic?.trim() || null,
    },
  });

  return NextResponse.json({ request: request_ });
}
