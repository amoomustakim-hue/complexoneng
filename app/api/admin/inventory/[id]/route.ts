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
  const { name, price, stock, condition, format, description } = body as {
    name?: string;
    price?: number;
    stock?: number;
    condition?: string;
    format?: string;
    description?: string;
  };

  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(price !== undefined && { price }),
      ...(stock !== undefined && { stock }),
      ...(condition !== undefined && { condition: condition.trim() || null }),
      ...(format !== undefined && { format: format.trim() || null }),
      ...(description !== undefined && { description: description.trim() || null }),
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.inventoryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
