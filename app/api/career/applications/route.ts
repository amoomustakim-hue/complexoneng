import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ applications: [] });
  }

  const applications = await prisma.universityApplication.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ applications });
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { universityName, country, program, deadline } = body as {
    universityName?: string;
    country?: string;
    program?: string;
    deadline?: string;
  };

  if (!universityName?.trim() || !country?.trim() || !program?.trim()) {
    return NextResponse.json(
      { error: "universityName, country, and program are required" },
      { status: 400 }
    );
  }

  const application = await prisma.universityApplication.create({
    data: {
      profileId: profile.id,
      universityName: universityName.trim(),
      country: country.trim(),
      program: program.trim(),
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  return NextResponse.json({ application });
}
