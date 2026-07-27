import { createHmac, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { auth } from "@clerk/nextjs/server";

const SESSION_MAX_SECS = 60 * 60 * 8; // 8 hours

function getAdminEmail(): string {
  const single = (process.env.ADMIN_EMAIL ?? "").trim();
  if (single) return single.toLowerCase();
  const legacy = (process.env.ADMIN_EMAILS ?? "").split(",")[0].trim();
  return legacy.toLowerCase();
}

// ADMIN_SESSION_SECRET preferred; falls back to ADMIN_PASSWORD.
// Rotating the secret invalidates all active admin sessions.
function sessionSecret(): string {
  return (process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "").trim();
}

// Creates a new signed session token: {randomId}.{expiry}.{hmac}
// Each login produces a unique token that expires after SESSION_MAX_SECS.
export function createAdminSession(): string {
  const id = randomBytes(16).toString("hex");
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_SECS;
  const payload = `${id}.${exp}`;
  const sig = createHmac("sha256", sessionSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function isAdminCookieValid(): boolean {
  const store = cookies();
  const raw = store.get("admin_session")?.value ?? "";
  const parts = raw.split(".");
  if (parts.length !== 3) return false;
  const [id, expStr, sig] = parts;
  const exp = parseInt(expStr, 10);
  if (isNaN(exp) || Math.floor(Date.now() / 1000) > exp) return false;
  const secret = sessionSecret();
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(`${id}.${expStr}`).digest("hex");
  return sig === expected;
}

// Reads the email from Clerk's session JWT claims (no API call, no DB lookup).
// Requires "email": "{{user.primary_email_address}}" in Clerk Dashboard → Sessions → Customize session token.
export async function isAdminClerkUser(): Promise<boolean> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  const userEmail = (
    (sessionClaims as Record<string, unknown>)?.email as string ?? ""
  ).toLowerCase().trim();
  return userEmail === adminEmail;
}
