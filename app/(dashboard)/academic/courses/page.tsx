import Link from "next/link";
import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { getCourseTagForLevel } from "@/lib/academic";
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

  const courseTag = getCourseTagForLevel(profile.level);

  if (!courseTag) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <p className="text-xs tracking-widest text-teal">COURSE CATALOG</p>
        <h1 className="text-2xl font-bold text-teal mt-1">No courses yet for your level</h1>
        <p className="text-sm text-muted mt-1">
          We don&apos;t have a course track set up for your academic level yet. Check back soon.
        </p>
      </div>
    );
  }

  const courses = await prisma.course.findMany({
    where: { levelTag: courseTag },
    orderBy: [{ order: "asc" }, { title: "asc" }],
    include: {
      modules: { include: { lessons: { select: { id: true } } } },
      enrollments: { where: { profileId: profile.id } },
      reviews: { select: { rating: true } },
    },
  });

  const lessonIds = courses.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: lessonIds } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">COURSE CATALOG</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {LEVEL_LABELS[courseTag] ?? courseTag} Mathematics
      </h1>
      <p className="text-sm text-muted mt-1">
        Courses matched to your level.{" "}
        <Link href="/onboarding" className="underline">
          Not your level?
        </Link>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {courses.map((course) => {
          const allLessons = course.modules.flatMap((m) => m.lessons);
          const totalLessons = allLessons.length;
          const completedLessons = allLessons.filter((l) => completedSet.has(l.id)).length;
          const pct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;
          const enrolled = course.enrollments.length > 0;
          const avgRating = course.reviews.length
            ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
            : null;

          return (
            <div key={course.id} className="rounded-xl border border-border-light bg-white p-5">
              <h3 className="font-bold text-teal">{course.title}</h3>
              <p className="text-sm text-muted mt-1">{course.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs text-muted">
                  {course.modules.length} modules · {totalLessons} lessons
                </p>
                {avgRating !== null && (
                  <span className="flex items-center gap-1 text-xs text-teal font-semibold">
                    <Star size={12} className="fill-lime text-lime" />
                    {avgRating.toFixed(1)} ({course.reviews.length})
                  </span>
                )}
              </div>

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

        {courses.length === 0 && (
          <p className="text-sm text-muted col-span-2">No courses available for your level yet.</p>
        )}
      </div>
    </div>
  );
}
