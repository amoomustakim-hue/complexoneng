import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { subject, title, levelTag, description, order } = body as {
    subject?: string;
    title?: string;
    levelTag?: string;
    description?: string;
    order?: number;
  };

  if (!subject?.trim() || !title?.trim() || !levelTag?.trim()) {
    return NextResponse.json(
      { error: "Subject, title, and level tag are required" },
      { status: 400 }
    );
  }

  const course = await prisma.course.create({
    data: {
      subject: subject.trim(),
      title: title.trim(),
      levelTag: levelTag.trim(),
      description: description?.trim() || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json({ course });
}
