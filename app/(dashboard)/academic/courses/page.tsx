import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import EnrollButton from "@/components/academic/EnrollButton";

const LEVEL_LABELS: Record<string, string> = {
  SS1: "SS1",
  SS2: "SS2",
  SS3: "SS3 / JAMB",
  "100L": "100 Level",
  "200L": "200 Level",
  "300L": "300 Level",
  "400L": "400 Level",
};

export default async function CourseCatalogPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const courses = await prisma.course.findMany({
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      modules: { include: { lessons: { select: { id: true } } } },
      enrollments: { where: { profileId: profile.id } },
    },
  });

  const lessonIds = courses.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: lessonIds } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  const grouped = courses.reduce<Record<string, typeof courses>>((acc, c) => {
    (acc[c.levelTag] ??= []).push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">COURSE CATALOG</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Mathematics curriculum</h1>
      <p className="text-sm text-muted mt-1">From SS1 all the way to 400 level.</p>

      {Object.entries(grouped).map(([levelTag, levelCourses]) => (
        <div key={levelTag} className="mt-8">
          <h2 className="text-sm font-bold text-teal tracking-wide">{LEVEL_LABELS[levelTag] ?? levelTag}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
            {levelCourses.map((course) => {
              const allLessons = course.modules.flatMap((m) => m.lessons);
              const totalLessons = allLessons.length;
              const completedLessons = allLessons.filter((l) => completedSet.has(l.id)).length;
              const pct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
              const enrolled = course.enrollments.length > 0;

              return (
                <div key={course.id} className="rounded-xl border border-border-light bg-white p-5">
                  <h3 className="font-bold text-teal">{course.title}</h3>
                  <p className="text-sm text-muted mt-1">{course.description}</p>
                  <p className="text-xs text-muted mt-2">
                    {course.modules.length} modules · {totalLessons} lessons
                  </p>

                  {enrolled && (
                    <div className="mt-3">
                      <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden">
                        <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted mt-1">{pct}% complete</p>
                    </div>
                  )}

                  <div className="mt-4">
                    <EnrollButton courseId={course.id} initialEnrolled={enrolled} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
