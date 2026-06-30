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
  const { title, order, contentType, textContent, videoUrl, pdfUrl } = body as {
    title?: string;
    order?: number;
    contentType?: string;
    textContent?: string;
    videoUrl?: string;
    pdfUrl?: string;
  };

  const lesson = await prisma.lesson.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(order !== undefined && { order }),
      ...(contentType !== undefined && { contentType: contentType as never }),
      ...(textContent !== undefined && { textContent: textContent.trim() || null }),
      ...(videoUrl !== undefined && { videoUrl: videoUrl.trim() || null }),
      ...(pdfUrl !== undefined && { pdfUrl: pdfUrl.trim() || null }),
    },
  });

  return NextResponse.json({ lesson });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.lesson.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
