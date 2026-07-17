import { createHash } from "crypto";
import { cookies } from "next/headers";
import { auth, currentUser } from "@clerk/nextjs/server";

export function computeAdminToken(): string {
  const email = process.env.ADMIN_EMAIL ?? "";
  const password = process.env.ADMIN_PASSWORD ?? "";
  if (!email || !password) return "";
  return createHash("sha256").update(`${email}:${password}`).digest("hex");
}

export async function isAdminCookieValid(): Promise<boolean> {
  const store = await cookies();
  const token = store.get("admin_session")?.value ?? "";
  const expected = computeAdminToken();
  return !!expected && token === expected;
}

// Returns true only if the currently signed-in Clerk account matches ADMIN_EMAIL
export async function isAdminClerkUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase().trim();
  if (!adminEmail) return false;
  const user = await currentUser();
  if (!user) return false;
  return user.emailAddresses.some(
    (e) => e.emailAddress.toLowerCase() === adminEmail
  );
}
