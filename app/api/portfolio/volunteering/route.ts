import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { organization, role, description, startDate, endDate } = (await req.json()) as {
    organization?: string;
    role?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  };

  if (!organization?.trim() || !role?.trim()) {
    return NextResponse.json({ error: "Organization and role are required" }, { status: 400 });
  }

  const entry = await prisma.volunteeringExperience.create({
    data: {
      profileId: profile.id,
      organization: organization.trim(),
      role: role.trim(),
      description: description?.trim() || null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  return NextResponse.json({ volunteering: entry });
}
