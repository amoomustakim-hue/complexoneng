import { NextResponse } from "next/server";
import { computeAdminToken } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const adminEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN_EMAILS?.split(",")[0] || "").trim().toLowerCase();
  const adminPassword = (process.env.ADMIN_PASSWORD ?? "").trim();

  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const { email, password } = await req.json();

  if (
    (email ?? "").trim().toLowerCase() !== adminEmail ||
    (password ?? "") !== adminPassword
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = computeAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return res;
}
