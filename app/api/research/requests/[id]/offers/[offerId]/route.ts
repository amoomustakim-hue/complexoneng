import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

type Ctx = { params: Promise<{ id: string; offerId: string }> };

// PATCH — requester accepts/declines an offer
export async function PATCH(req: Request, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { id, offerId } = await params;
  const request_ = await prisma.researchRequest.findUnique({ where: { id } });
  if (!request_ || request_.profileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status } = (await req.json()) as { status?: string };
  if (status !== "ACCEPTED" && status !== "DECLINED") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const offer = await prisma.researchOffer.update({
    where: { id: offerId },
    data: { status },
  });

  // Auto-progress request to IN_PROGRESS when an offer is accepted
  if (status === "ACCEPTED") {
    await prisma.researchRequest.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
    });
  }

  return NextResponse.json({ offer });
}

// DELETE — helper withdraws their own pending offer
export async function DELETE(_req: Request, { params }: Ctx) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { offerId } = await params;
  const offer = await prisma.researchOffer.findUnique({ where: { id: offerId } });
  if (!offer || offer.profileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (offer.status !== "PENDING") {
    return NextResponse.json({ error: "Can only withdraw pending offers" }, { status: 400 });
  }

  await prisma.researchOffer.delete({ where: { id: offerId } });
  return NextResponse.json({ ok: true });
}
