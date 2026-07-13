import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export function isAdminEmail(email: string): boolean {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export async function requireAdminProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) return null;

  const isAdmin = profile.isAdmin || isAdminEmail(profile.email);
  if (!isAdmin) return null;

  // Auto-promote in DB on first bootstrap match
  if (!profile.isAdmin) {
    await prisma.profile.update({ where: { id: profile.id }, data: { isAdmin: true } });
  }

  return { ...profile, isAdmin: true as const };
}
