import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { subject, title, levelTag, description, order } = body as {
    subject?: string;
    title?: string;
    levelTag?: string;
    description?: string;
    order?: number;
  };

  const course = await prisma.course.update({
    where: { id },
    data: {
      ...(subject !== undefined && { subject: subject.trim() }),
      ...(title !== undefined && { title: title.trim() }),
      ...(levelTag !== undefined && { levelTag: levelTag.trim() }),
      ...(description !== undefined && { description: description.trim() || null }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ course });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
