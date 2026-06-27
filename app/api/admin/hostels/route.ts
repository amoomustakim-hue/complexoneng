import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hostels = await prisma.hostel.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ hostels });
}

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, type, area, pricePerYear, deposit, roomsAvailable } = body as {
    name?: string;
    type?: string;
    area?: string;
    pricePerYear?: number;
    deposit?: number;
    roomsAvailable?: number;
  };

  if (!name?.trim() || !type || !area?.trim() || typeof pricePerYear !== "number") {
    return NextResponse.json(
      { error: "Name, type, area, and price per year are required" },
      { status: 400 }
    );
  }

  const hostel = await prisma.hostel.create({
    data: {
      name: name.trim(),
      type: type as never,
      area: area.trim(),
      pricePerYear,
      deposit: deposit ?? 0,
      roomsAvailable: roomsAvailable ?? 0,
    },
  });

  return NextResponse.json({ hostel });
}
