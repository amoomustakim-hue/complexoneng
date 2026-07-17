import { createHash } from "crypto";
import { cookies } from "next/headers";

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

export function getConfiguredAdminEmail(): string {
  return getAdminEmail();
}
