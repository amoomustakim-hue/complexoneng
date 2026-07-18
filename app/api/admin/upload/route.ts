import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireAdminProfile } from "@/lib/admin";

export async function POST(req: Request) {
  const admin = await requireAdminProfile();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
  }
  if (file.size > 20 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 20 MB)" }, { status: 400 });
  }

  const blob = await put(`lessons/${Date.now()}-${file.name}`, file, {
    access: "public",
    contentType: "application/pdf",
  });

  return NextResponse.json({ url: blob.url });
}
