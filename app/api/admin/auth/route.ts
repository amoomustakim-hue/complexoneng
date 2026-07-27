import { NextResponse } from "next/server";
import { createAdminSession, isAdminClerkUser } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const isAdmin = await isAdminClerkUser();
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const adminPassword = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!adminPassword) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
  }

  const { password } = await req.json();
  if ((password ?? "") !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // matches SESSION_MAX_SECS in admin-auth.ts
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_session", "", { maxAge: 0, path: "/" });
  return res;
}
