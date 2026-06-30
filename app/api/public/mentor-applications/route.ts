import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { fullName, email, whatsapp, expertise, bio, linkedin } = (await req.json()) as {
    fullName?: string;
    email?: string;
    whatsapp?: string;
    expertise?: string;
    bio?: string;
    linkedin?: string;
  };

  if (!fullName?.trim() || !email?.trim() || !expertise?.trim() || !bio?.trim()) {
    return NextResponse.json(
      { error: "Full name, email, expertise, and bio are required" },
      { status: 400 }
    );
  }

  await prisma.mentorApplication.create({
    data: {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      whatsapp: whatsapp?.trim() || null,
      expertise: expertise.trim(),
      bio: bio.trim(),
      linkedin: linkedin?.trim() || null,
    },
  });

  return NextResponse.json({ ok: true });
}
