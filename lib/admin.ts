import { isAdminCookieValid } from "@/lib/admin-auth";

export function requireAdminProfile() {
  const valid = isAdminCookieValid();
  return valid ? { isAdmin: true as const } : null;
}
