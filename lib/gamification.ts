import { prisma } from "@/lib/prisma";

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function isYesterday(date: Date, today: Date) {
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(date, yesterday);
}

export async function awardActivity(profileId: string, points: number) {
  const profile = await prisma.profile.findUnique({ where: { id: profileId } });
  if (!profile) return;

  const now = new Date();
  let nextStreak = profile.currentStreak;

  if (!profile.lastActivityAt) {
    nextStreak = 1;
  } else if (isSameDay(profile.lastActivityAt, now)) {
    nextStreak = profile.currentStreak || 1;
  } else if (isYesterday(profile.lastActivityAt, now)) {
    nextStreak = profile.currentStreak + 1;
  } else {
    nextStreak = 1;
  }

  await prisma.profile.update({
    where: { id: profileId },
    data: {
      points: { increment: points },
      currentStreak: nextStreak,
      longestStreak: Math.max(profile.longestStreak, nextStreak),
      lastActivityAt: now,
    },
  });
}
