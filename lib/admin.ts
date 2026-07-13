import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export function isAdminUser(email: string, clerkUserId?: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const adminUserIds = (process.env.ADMIN_CLERK_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return (
    adminEmails.includes(email.toLowerCase()) ||
    (!!clerkUserId && adminUserIds.includes(clerkUserId))
  );
}

// Keep backwards-compatible alias used in home/page.tsx
export function isAdminEmail(email: string): boolean {
  return isAdminUser(email);
}

export async function requireAdminProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return null;

  const isAdmin = profile.isAdmin || isAdminUser(profile.email, userId);
  if (!isAdmin) return null;

  // Auto-promote in DB on first bootstrap match so subsequent checks are instant
  if (!profile.isAdmin) {
    try {
      await prisma.profile.update({ where: { id: profile.id }, data: { isAdmin: true } });
    } catch {
      // Non-fatal: flag will be set next time
    }
  }

  return { ...profile, isAdmin: true as const };
}
