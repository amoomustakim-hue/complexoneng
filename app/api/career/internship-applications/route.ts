import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return NextResponse.json({ applications: [] });

  const applications = await prisma.internshipApplication.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const { company, role, industry, location, deadline, notes } = (await req.json()) as {
    company: string;
    role: string;
    industry?: string;
    location?: string;
    deadline?: string;
    notes?: string;
  };

  if (!company?.trim() || !role?.trim()) {
    return NextResponse.json({ error: "Company and role are required" }, { status: 400 });
  }

  const application = await prisma.internshipApplication.create({
    data: {
      profileId: profile.id,
      company,
      role,
      industry: industry ?? null,
      location: location ?? null,
      deadline: deadline ? new Date(deadline) : null,
      notes: notes ?? null,
    },
  });

  return NextResponse.json({ application });
}
