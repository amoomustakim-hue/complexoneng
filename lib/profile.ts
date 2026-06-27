import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.profile.findUnique({ where: { clerkUserId: userId } });
}

export async function getOrCreateProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const existing = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (existing) return existing;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  return prisma.profile.create({
    data: {
      clerkUserId: userId,
      email,
      fullName: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : null,
    },
  });
}
