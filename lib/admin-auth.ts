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
// Falls back to email lookup + userId migration to handle Clerk dev→prod mismatch.
export async function isAdminClerkUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  // Fast path: profile already linked to this Clerk userId
  const byId = await prisma.profile.findUnique({
    where: { clerkUserId: userId },
    select: { email: true },
  });
  if (byId) return byId.email.toLowerCase() === adminEmail;

  // Fallback: look up the admin profile by email (handles dev→prod userId mismatch).
  // If found, re-link it to the current production userId.
  const byEmail = await prisma.profile.findUnique({
    where: { email: adminEmail },
    select: { clerkUserId: true },
  });
  if (byEmail) {
    try {
      await prisma.profile.update({
        where: { email: adminEmail },
        data: { clerkUserId: userId },
      });
    } catch { /* non-fatal — will succeed on next request */ }
    return true;
  }

  return false;
}
