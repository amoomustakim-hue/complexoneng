import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { BookOpen, ClipboardList, Sparkles } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import GuardianAccessToggle from "@/components/academic/GuardianAccessToggle";

export default async function AcademicOverviewPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const enrollments = await prisma.enrollment.findMany({
    where: { profileId: profile.id },
    orderBy: { enrolledAt: "desc" },
    include: {
      course: {
        include: { modules: { include: { lessons: { orderBy: { order: "asc" } } }, orderBy: { order: "asc" } } },
      },
    },
  });

  const allLessonIds = enrollments.flatMap((e) => e.course.modules.flatMap((m) => m.lessons.map((l) => l.id)));
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: allLessonIds } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  const cbtSessions = await prisma.cbtSession.findMany({ where: { profileId: profile.id } });
  const avgScore = cbtSessions.length
    ? Math.round(
        (cbtSessions.reduce((acc, s) => acc + s.score / s.total, 0) / cbtSessions.length) * 100
      )
    : null;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">ACADEMIC SUCCESS HUB</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {profile.fullName ? `Welcome back, ${profile.fullName.split(" ")[0]}` : "Welcome back"}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link
          href="/academic/courses"
          className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
        >
          <BookOpen className="text-teal" size={20} />
          <p className="text-xs font-medium text-teal">Course Catalog</p>
        </Link>
        <Link
          href="/academic/cbt"
          className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
        >
          <ClipboardList className="text-teal" size={20} />
          <p className="text-xs font-medium text-teal">CBT Practice</p>
        </Link>
        <Link
          href="/academic/coach"
          className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
        >
          <Sparkles className="text-teal" size={20} />
          <p className="text-xs font-medium text-teal">AI Coach</p>
        </Link>
      </div>

      {avgScore !== null && (
        <div className="rounded-xl border border-border-light bg-white p-5 mt-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted">CBT average score</p>
            <p className="text-xl font-bold text-teal">{avgScore}%</p>
          </div>
          <Link href="/academic/dashboard" className="text-sm font-semibold text-teal underline">
            View full performance →
          </Link>
        </div>
      )}

      <p className="text-xs tracking-widest text-teal mt-8">CONTINUE LEARNING</p>

      <div className="flex flex-col gap-3 mt-3">
        {enrollments.map((e) => {
          const allLessons = e.course.modules.flatMap((m) => m.lessons);
          const completedLessons = allLessons.filter((l) => completedSet.has(l.id));
          const pct = allLessons.length
            ? Math.round((completedLessons.length / allLessons.length) * 100)
            : 0;
          const nextLesson = allLessons.find((l) => !completedSet.has(l.id)) ?? allLessons[0];

          return (
            <Link
              key={e.id}
              href={`/academic/courses/${e.course.id}?lesson=${nextLesson?.id ?? ""}`}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-teal">{e.course.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {completedLessons.length}/{allLessons.length} lessons complete
                  </p>
                </div>
                <span className="text-sm font-semibold text-teal">Continue →</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden mt-3">
                <div className="h-full bg-teal" style={{ width: `${pct}%` }} />
              </div>
            </Link>
          );
        })}

        {enrollments.length === 0 && (
          <div className="rounded-xl border border-dashed border-border-light p-8 text-center">
            <p className="text-sm text-muted">
              You&apos;re not enrolled in any courses yet.
            </p>
            <Link
              href="/academic/courses"
              className="inline-block mt-3 text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
            >
              Browse the course catalog
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8">
        <GuardianAccessToggle
          initialEnabled={profile.guardianAccess}
          initialSlug={profile.guardianSlug}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  );
}
