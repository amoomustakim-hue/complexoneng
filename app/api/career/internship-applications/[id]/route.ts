import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = (await req.json()) as { status: string };

  const application = await prisma.internshipApplication.update({
    where: { id },
    data: { status: status as "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED" },
  });

  return NextResponse.json({ application });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.internshipApplication.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
