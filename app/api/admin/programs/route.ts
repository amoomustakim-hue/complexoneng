import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { name, country, program, requirements, link } = body as {
    name?: string;
    country?: string;
    program?: string;
    requirements?: string;
    link?: string;
  };

  if (!name?.trim() || !country?.trim() || !program?.trim()) {
    return NextResponse.json(
      { error: "University name, country, and program are required" },
      { status: 400 }
    );
  }

  const universityProgram = await prisma.universityProgram.create({
    data: {
      name: name.trim(),
      country: country.trim(),
      program: program.trim(),
      requirements: requirements?.trim() || null,
      link: link?.trim() || null,
    },
  });

  return NextResponse.json({ program: universityProgram });
}
