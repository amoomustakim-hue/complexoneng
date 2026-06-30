import { NextResponse } from "next/server";
import { requireAdminProfile } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { title, provider, type, category, description, eligibility, deadline, link, level } =
    body as {
      title?: string;
      provider?: string;
      type?: string;
      category?: string;
      description?: string;
      eligibility?: string;
      deadline?: string;
      link?: string;
      level?: string;
    };

  if (!title?.trim() || !provider?.trim() || !type || !description?.trim() || !link?.trim()) {
    return NextResponse.json(
      { error: "Title, provider, type, description, and link are required" },
      { status: 400 }
    );
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      title: title.trim(),
      provider: provider.trim(),
      type: type as never,
      category: (category as never) || null,
      description: description.trim(),
      eligibility: eligibility?.trim() || null,
      deadline: deadline ? new Date(deadline) : null,
      link: link.trim(),
      level: (level as never) || null,
    },
  });

  return NextResponse.json({ opportunity });
}
