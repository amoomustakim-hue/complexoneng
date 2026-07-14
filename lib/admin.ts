import { isAdminCookieValid } from "@/lib/admin-auth";

export async function requireAdminProfile() {
  const valid = await isAdminCookieValid();
  return valid ? { isAdmin: true as const } : null;
}
