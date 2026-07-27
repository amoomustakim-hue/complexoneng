import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getRedis } from "@/lib/redis";

const PROFILE_TTL = 300; // 5 minutes

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  const redis = getRedis();
  const cacheKey = `profile:${userId}`;

  if (redis) {
    try {
      const cached = await redis.get(cacheKey);
      if (cached) return cached as Awaited<ReturnType<typeof prisma.profile.findUnique>>;
    } catch {}
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });

  if (profile && redis) {
    try {
      await redis.set(cacheKey, profile, { ex: PROFILE_TTL });
    } catch {}
  }

  return profile;
}

export async function getOrCreateProfile() {
  const { userId } = await auth();
  if (!userId) return null;

  // Fast path: profile already linked to this Clerk userId
  const existing = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (existing) return existing;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  // If a profile with this email exists but a different clerkUserId (e.g. the Clerk account was
  // deleted and re-created), re-link it and reset onboarded so the user goes through setup again.
  if (email) {
    const orphaned = await prisma.profile.findUnique({ where: { email } });
    if (orphaned) {
      return prisma.profile.update({
        where: { email },
        data: { clerkUserId: userId, onboarded: false },
      });
    }
  }

  const approvedMentorApplication = email
    ? await prisma.mentorApplication.findFirst({
        where: { email: email.toLowerCase(), status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      })
    : null;

  return prisma.profile.create({
    data: {
      clerkUserId: userId,
      email,
      fullName: user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : null,
      ...(approvedMentorApplication && {
        isMentor: true,
        mentorBio: approvedMentorApplication.bio,
        mentorExpertise: approvedMentorApplication.expertise,
      }),
    },
  });
}
