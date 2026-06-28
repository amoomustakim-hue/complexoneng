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

  const { title, issuer, dateIssued, link } = (await req.json()) as {
    title?: string;
    issuer?: string;
    dateIssued?: string;
    link?: string;
  };

  if (!title?.trim() || !issuer?.trim()) {
    return NextResponse.json({ error: "Title and issuer are required" }, { status: 400 });
  }

  const certificate = await prisma.certificate.create({
    data: {
      profileId: profile.id,
      title: title.trim(),
      issuer: issuer.trim(),
      dateIssued: dateIssued ? new Date(dateIssued) : null,
      link: link?.trim() || null,
    },
  });

  return NextResponse.json({ certificate });
}
