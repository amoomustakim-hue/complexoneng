import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateGuardianSlug } from "@/lib/guardian";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { enabled } = (await req.json()) as { enabled: boolean };

  if (enabled) {
    await getOrCreateGuardianSlug(profile.id);
  }

  const updated = await prisma.profile.update({
    where: { id: profile.id },
    data: { guardianAccess: enabled },
  });

  return NextResponse.json({ guardianAccess: updated.guardianAccess, guardianSlug: updated.guardianSlug });
}
