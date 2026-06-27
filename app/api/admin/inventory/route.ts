import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const items = await prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, category, price, stock, condition, format, description } = body as {
    name?: string;
    category?: string;
    price?: number;
    stock?: number;
    condition?: string;
    format?: string;
    description?: string;
  };

  if (!name?.trim() || !category || typeof price !== "number") {
    return NextResponse.json({ error: "Name, category, and price are required" }, { status: 400 });
  }

  const item = await prisma.inventoryItem.create({
    data: {
      name: name.trim(),
      category: category as never,
      price,
      stock: stock ?? 0,
      condition: condition?.trim() || null,
      format: format?.trim() || null,
      description: description?.trim() || null,
    },
  });

  return NextResponse.json({ item });
}
