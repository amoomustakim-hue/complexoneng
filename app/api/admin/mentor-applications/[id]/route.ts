import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = (await req.json()) as { status?: string };

  if (status !== "APPROVED" && status !== "REJECTED" && status !== "PENDING") {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const application = await prisma.mentorApplication.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json({ application });
}
