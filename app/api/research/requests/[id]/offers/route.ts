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

  const { id } = await params;
  const request_ = await prisma.researchRequest.findUnique({ where: { id } });
  if (!request_) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }
  if (request_.profileId === profile.id) {
    return NextResponse.json({ error: "You can't offer help on your own request" }, { status: 400 });
  }

  const { message } = (await req.json()) as { message?: string };
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const offer = await prisma.researchOffer.create({
    data: {
      requestId: id,
      profileId: profile.id,
      message: message.trim(),
    },
    include: { profile: true },
  });

  return NextResponse.json({ offer });
}
