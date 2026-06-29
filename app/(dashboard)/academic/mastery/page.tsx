import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { getCourseTagForLevel } from "@/lib/academic";
import { getMasteryBucket, MASTERY_LABELS, MASTERY_STYLES, computeModuleMastery } from "@/lib/mastery";

export default async function MasteryMapPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const courseTag = getCourseTagForLevel(profile.level);

  if (!courseTag) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-xs tracking-widest text-teal">MASTERY MAP</p>
        <h1 className="text-2xl font-bold text-teal mt-1">No map yet for your level</h1>
      </div>
    );
  }

  const courses = await prisma.course.findMany({
    where: { levelTag: courseTag },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: true } } },
  });

  const allLessonIds = courses.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const allModuleIds = courses.flatMap((c) => c.modules.map((m) => m.id));

  const [progress, quizAttempts] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { profileId: profile.id, lessonId: { in: allLessonIds } },
    }),
    prisma.moduleQuizAttempt.findMany({
      where: { profileId: profile.id, moduleId: { in: allModuleIds } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const completedSet = new Set(progress.map((p) => p.lessonId));
  const latestAttemptByModule = new Map<string, { score: number; total: number }>();
  for (const attempt of quizAttempts) {
    if (!latestAttemptByModule.has(attempt.moduleId)) {
      latestAttemptByModule.set(attempt.moduleId, { score: attempt.score, total: attempt.total });
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">MASTERY MAP</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Your Mathematics skill map</h1>
      <p className="text-sm text-muted mt-1">
        Mastery blends lesson completion with your checkpoint quiz scores.
      </p>

      {courses.map((course) => (
        <div key={course.id} className="mt-8">
          <h2 className="text-sm font-bold text-teal tracking-wide">{course.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {course.modules.map((module_) => {
              const lessonRatio = module_.lessons.length
                ? module_.lessons.filter((l) => completedSet.has(l.id)).length / module_.lessons.length
                : 0;
              const attempt = latestAttemptByModule.get(module_.id);
              const quizRatio = attempt ? attempt.score / attempt.total : null;
              const pct = computeModuleMastery(lessonRatio, quizRatio);
              const bucket = getMasteryBucket(pct);

              return (
                <Link
                  key={module_.id}
                  href={`/academic/courses/${course.id}?lesson=${module_.lessons[0]?.id ?? ""}`}
                  className={`rounded-xl border-2 p-4 transition hover:opacity-90 ${MASTERY_STYLES[bucket]}`}
                >
                  <p className="font-bold text-sm">{module_.title}</p>
                  <p className="text-xs opacity-80 mt-1">{MASTERY_LABELS[bucket]}</p>
                  <div className="h-1.5 w-full rounded-full bg-black/10 overflow-hidden mt-2">
                    <div className="h-full bg-lime" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs opacity-70 mt-1">{pct}%</p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
