import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function requireAdminProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile?.isAdmin) return null;

  return profile;
}
