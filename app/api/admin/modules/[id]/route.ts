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
  const { title, order } = body as { title?: string; order?: number };

  const module_ = await prisma.module.update({
    where: { id },
    data: {
      ...(title !== undefined && { title: title.trim() }),
      ...(order !== undefined && { order }),
    },
  });

  return NextResponse.json({ module: module_ });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.module.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
