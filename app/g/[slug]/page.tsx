import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function GuardianViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const profile = await prisma.profile.findUnique({ where: { guardianSlug: slug } });
  if (!profile || !profile.guardianAccess) {
    notFound();
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { profileId: profile.id },
    include: {
      course: { include: { modules: { include: { lessons: true } } } },
    },
  });

  const allLessonIds = enrollments.flatMap((e) => e.course.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: allLessonIds } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  const cbtSessions = await prisma.cbtSession.findMany({ where: { profileId: profile.id } });
  const avgScore = cbtSessions.length
    ? Math.round((cbtSessions.reduce((acc, s) => acc + s.score / s.total, 0) / cbtSessions.length) * 100)
    : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border-light bg-white px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-teal text-lg">
          ComplexOne
        </Link>
        <span className="text-xs text-muted">Read-only progress view</span>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-xs tracking-widest text-teal">PROGRESS SUMMARY</p>
        <h1 className="text-2xl font-bold text-teal mt-1">
          {profile.fullName ?? "Student"}
        </h1>
        <p className="text-sm text-muted mt-1">
          {profile.school ?? ""}
          {profile.level ? ` · ${profile.level}` : ""}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl border border-border-light bg-white p-4">
            <p className="text-xs text-muted">CBT attempts</p>
            <p className="text-xl font-bold text-teal">{cbtSessions.length}</p>
          </div>
          <div className="rounded-xl border border-border-light bg-white p-4">
            <p className="text-xs text-muted">Average score</p>
            <p className="text-xl font-bold text-teal">{avgScore !== null ? `${avgScore}%` : "—"}</p>
          </div>
        </div>

        <p className="text-xs tracking-widest text-teal mt-8">COURSES</p>
        <div className="flex flex-col gap-3 mt-3">
          {enrollments.map((e) => {
            const allLessons = e.course.modules.flatMap((m) => m.lessons);
            const completedLessons = allLessons.filter((l) => completedSet.has(l.id)).length;
            const pct = allLessons.length ? Math.round((completedLessons / allLessons.length) * 100) : 0;

            return (
              <div key={e.id} className="rounded-xl border border-border-light bg-white p-4">
                <p className="font-bold text-teal text-sm">{e.course.title}</p>
                <p className="text-xs text-muted mt-0.5">
                  {completedLessons}/{allLessons.length} lessons complete
                </p>
                <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden mt-2">
                  <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
          {enrollments.length === 0 && (
            <p className="text-sm text-muted">Not enrolled in any courses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
