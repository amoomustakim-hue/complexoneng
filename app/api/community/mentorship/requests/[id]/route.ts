import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["ACCEPTED", "DECLINED", "COMPLETED"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { id } = await params;
  const request_ = await prisma.mentorshipRequest.findUnique({ where: { id } });
  if (!request_ || request_.mentorId !== profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { status } = (await req.json()) as { status?: string };
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const updated = await prisma.mentorshipRequest.update({
    where: { id },
    data: { status: status as never },
  });

  return NextResponse.json({ request: updated });
}
