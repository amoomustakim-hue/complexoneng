import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { moduleId, title, order, contentType, textContent, videoUrl, pdfUrl } = body as {
    moduleId?: string;
    title?: string;
    order?: number;
    contentType?: string;
    textContent?: string;
    videoUrl?: string;
    pdfUrl?: string;
  };

  if (!moduleId?.trim() || !title?.trim()) {
    return NextResponse.json({ error: "Module and title are required" }, { status: 400 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      moduleId: moduleId.trim(),
      title: title.trim(),
      order: order ?? 0,
      contentType: (contentType as never) ?? "TEXT",
      textContent: textContent?.trim() || null,
      videoUrl: videoUrl?.trim() || null,
      pdfUrl: pdfUrl?.trim() || null,
    },
  });

  return NextResponse.json({ lesson });
}
