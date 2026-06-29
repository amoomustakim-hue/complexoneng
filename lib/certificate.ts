import { prisma } from "@/lib/prisma";

function randomSlug() {
  return Math.random().toString(36).slice(2, 10);
}

export async function checkAndIssueCertificate(profileId: string, courseId: string) {
  const existing = await prisma.courseCertificate.findUnique({
    where: { profileId_courseId: { profileId, courseId } },
  });
  if (existing) return existing;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: { include: { lessons: { select: { id: true } } } } },
  });
  if (!course) return null;

  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
  if (allLessonIds.length === 0) return null;

  const completedCount = await prisma.lessonProgress.count({
    where: { profileId, lessonId: { in: allLessonIds } },
  });

  if (completedCount < allLessonIds.length) return null;

  let slug = randomSlug();
  while (await prisma.courseCertificate.findUnique({ where: { certificateSlug: slug } })) {
    slug = randomSlug();
  }

  return prisma.courseCertificate.create({
    data: { profileId, courseId, certificateSlug: slug },
  });
}
