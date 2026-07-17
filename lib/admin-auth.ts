import { createHash } from "crypto";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function getAdminEmail(): string {
  // Accept ADMIN_EMAIL (current) or first entry of ADMIN_EMAILS (legacy)
  const single = (process.env.ADMIN_EMAIL ?? "").trim();
  if (single) return single.toLowerCase();
  const legacy = (process.env.ADMIN_EMAILS ?? "").split(",")[0].trim();
  return legacy.toLowerCase();
}

export function computeAdminToken(): string {
  const email = getAdminEmail();
  const password = (process.env.ADMIN_PASSWORD ?? "").trim();
  if (!email || !password) return "";
  return createHash("sha256").update(`${email}:${password}`).digest("hex");
}

export function isAdminCookieValid(): boolean {
  const store = cookies();
  const token = store.get("admin_session")?.value ?? "";
  const expected = computeAdminToken();
  return !!expected && token === expected;
}

// Check the signed-in Clerk user's email against ADMIN_EMAIL using the DB.
// Avoids calling Clerk's currentUser() API (which can return null in production).
export async function isAdminClerkUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    select: { email: true },
  });

  if (!profile?.email) return false;
  return profile.email.toLowerCase() === adminEmail;
}
