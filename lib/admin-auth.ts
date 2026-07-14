import { createHash } from "crypto";
import { cookies } from "next/headers";

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
