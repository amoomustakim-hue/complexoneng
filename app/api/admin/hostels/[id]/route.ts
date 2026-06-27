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
  const { name, area, pricePerYear, deposit, roomsAvailable } = body as {
    name?: string;
    area?: string;
    pricePerYear?: number;
    deposit?: number;
    roomsAvailable?: number;
  };

  const hostel = await prisma.hostel.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(area !== undefined && { area: area.trim() }),
      ...(pricePerYear !== undefined && { pricePerYear }),
      ...(deposit !== undefined && { deposit }),
      ...(roomsAvailable !== undefined && { roomsAvailable }),
    },
  });

  return NextResponse.json({ hostel });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.hostel.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
