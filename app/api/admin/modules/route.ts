import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { courseId, title, order } = body as {
    courseId?: string;
    title?: string;
    order?: number;
  };

  if (!courseId?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "Course and title are required" }, { status: 400 });
  }

  const module_ = await prisma.module.create({
    data: { courseId: courseId.trim(), title: title.trim(), order: order ?? 0 },
  });

  return NextResponse.json({ module: module_ });
}
