import { createHash } from "crypto";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

function getAdminEmail(): string {
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

// Reads the email from Clerk's session JWT claims (no API call, no DB lookup).
// Requires "email": "{{user.primary_email_address}}" in Clerk Dashboard → Sessions → Customize session token.
export async function isAdminClerkUser(): Promise<boolean> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  const userEmail = ((sessionClaims as Record<string, unknown>)?.email as string ?? "").toLowerCase().trim();
  return userEmail === adminEmail;
}
