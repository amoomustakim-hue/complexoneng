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

  // Fast path: profile already linked to this Clerk userId
  const existing = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (existing) return existing;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  // Handle dev→prod migration: same email, different Clerk userId (different environments)
  // Clerk Dev and Clerk Prod generate different user IDs for the same account.
  // If a profile with this email already exists, re-link it to the production userId.
  if (email) {
    const byEmail = await prisma.profile.findUnique({ where: { email } });
    if (byEmail) {
      return prisma.profile.update({
        where: { email },
        data: { clerkUserId: userId },
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
