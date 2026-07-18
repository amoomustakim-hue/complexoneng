import Link from "next/link";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { BookOpen, ClipboardList, Sparkles, Map, Flame, Trophy, TrendingUp, Target } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import GuardianAccessToggle from "@/components/academic/GuardianAccessToggle";
import PerformanceChart from "@/components/academic/PerformanceChart";

export default async function AcademicDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const [enrollments, cbtSessions] = await Promise.all([
    prisma.enrollment.findMany({
      where: { profileId: profile.id },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: {
          include: {
            modules: {
              include: { lessons: { orderBy: { order: "asc" } } },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    }),
    prisma.cbtSession.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const allLessonIds = enrollments.flatMap((e) =>
    e.course.modules.flatMap((m) => m.lessons.map((l) => l.id))
  );
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: allLessonIds } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  const totalLessons = allLessonIds.length;
  const completedLessons = progress.length;
  const overallPct = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const totalAttempts = cbtSessions.length;
  const avgScore = totalAttempts
    ? Math.round(
        (cbtSessions.reduce((acc, s) => acc + s.score / s.total, 0) / totalAttempts) * 100
      )
    : null;

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs tracking-widest text-muted">ACADEMIC SUCCESS HUB</p>
          <h1 className="text-2xl font-bold text-teal mt-1">
            {profile.fullName ? `Welcome back, ${profile.fullName.split(" ")[0]}` : "Welcome back"}
          </h1>
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Streak</span>
          </div>
          <p className="text-3xl font-bold text-teal">{profile.currentStreak}</p>
          <p className="text-xs text-muted">day{profile.currentStreak !== 1 ? "s" : ""} in a row</p>
        </div>

        <div className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-lime">
            <Trophy size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Points</span>
          </div>
          <p className="text-3xl font-bold text-teal">{profile.points}</p>
          <p className="text-xs text-muted">total earned</p>
        </div>

        <div className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-teal">
            <TrendingUp size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">CBT Score</span>
          </div>
          <p className="text-3xl font-bold text-teal">{avgScore !== null ? `${avgScore}%` : "—"}</p>
          <p className="text-xs text-muted">{totalAttempts} attempt{totalAttempts !== 1 ? "s" : ""}</p>
        </div>

        <div className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-teal">
            <Target size={18} />
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">Progress</span>
          </div>
          <p className="text-3xl font-bold text-teal">{overallPct}%</p>
          <p className="text-xs text-muted">{completedLessons}/{totalLessons} lessons done</p>
        </div>
      </div>

      {/* UTME Prep Hub — JAMB candidates only */}
      {profile.level === "JAMB" && (
        <div>
          <p className="text-xs tracking-widest text-muted mb-3">UTME PREP HUB</p>
          <div className="rounded-2xl bg-teal p-6 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex-1">
              <p className="text-xs tracking-widest text-cream/60 mb-1">JAMB CANDIDATE</p>
              <h2 className="text-lg font-bold text-cream">Ready to crush your UTME?</h2>
              {profile.courseOfStudy && (
                <p className="text-sm text-cream/70 mt-1">
                  Subjects: {profile.courseOfStudy}
                </p>
              )}
              <p className="text-sm text-cream/60 mt-1">
                Practice timed CBT questions by subject — same format as the real exam.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/academic/cbt"
                className="bg-white text-teal text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition"
              >
                Start CBT Practice
              </Link>
              <Link
                href="/academic/coach"
                className="bg-teal-light/40 border border-cream/20 text-cream text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-teal-light/60 transition"
              >
                Ask AI Coach
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Feature cards */}
      <div>
        <p className="text-xs tracking-widest text-muted mb-3">QUICK ACCESS</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/academic/courses"
            className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-3 hover:shadow-clay-dark transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center group-hover:bg-teal transition">
              <BookOpen size={18} className="text-teal group-hover:text-cream transition" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal">My Courses</p>
              <p className="text-xs text-muted mt-0.5">{enrollments.length} enrolled</p>
            </div>
          </Link>

          <Link
            href="/academic/mastery"
            className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-3 hover:shadow-clay-dark transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center group-hover:bg-teal transition">
              <Map size={18} className="text-teal group-hover:text-cream transition" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal">Mastery Map</p>
              <p className="text-xs text-muted mt-0.5">Track your skills</p>
            </div>
          </Link>

          <Link
            href="/academic/cbt"
            className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-3 hover:shadow-clay-dark transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center group-hover:bg-teal transition">
              <ClipboardList size={18} className="text-teal group-hover:text-cream transition" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal">CBT Practice</p>
              <p className="text-xs text-muted mt-0.5">{totalAttempts} session{totalAttempts !== 1 ? "s" : ""} done</p>
            </div>
          </Link>

          <Link
            href="/academic/coach"
            className="rounded-2xl bg-white shadow-clay p-5 flex flex-col gap-3 hover:shadow-clay-dark transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center group-hover:bg-teal transition">
              <Sparkles size={18} className="text-teal group-hover:text-cream transition" />
            </div>
            <div>
              <p className="text-sm font-bold text-teal">AI Coach</p>
              <p className="text-xs text-muted mt-0.5">Ask anything</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Continue learning */}
      <div>
        <p className="text-xs tracking-widest text-muted mb-3">CONTINUE LEARNING</p>
        <div className="flex flex-col gap-3">
          {enrollments.map((e) => {
            const all = e.course.modules.flatMap((m) => m.lessons);
            const done = all.filter((l) => completedSet.has(l.id));
            const pct = all.length ? Math.round((done.length / all.length) * 100) : 0;
            const nextLesson = all.find((l) => !completedSet.has(l.id)) ?? all[0];
            return (
              <Link
                key={e.id}
                href={`/academic/courses/${e.course.id}?lesson=${nextLesson?.id ?? ""}`}
                className="rounded-2xl bg-white shadow-clay p-5 hover:shadow-clay-dark transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-teal">{e.course.title}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {done.length}/{all.length} lessons · {pct}% complete
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-teal shrink-0">Continue →</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-border-light overflow-hidden mt-3">
                  <div className="h-full bg-teal transition-all" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}

          {enrollments.length === 0 && (
            <div className="rounded-2xl bg-white shadow-clay p-8 text-center">
              <p className="text-sm text-muted">You&apos;re not enrolled in any courses yet.</p>
              <Link
                href="/academic/courses"
                className="inline-block mt-3 text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
              >
                Browse the course catalog
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CBT performance chart */}
      {cbtSessions.length > 0 && (
        <div>
          <p className="text-xs tracking-widest text-muted mb-3">CBT PERFORMANCE</p>
          <div className="rounded-2xl bg-white shadow-clay p-6">
            <PerformanceChart
              sessions={cbtSessions.map((s) => ({
                id: s.id,
                subject: s.subject,
                score: s.score,
                total: s.total,
                createdAt: s.createdAt.toISOString(),
              }))}
            />
          </div>
        </div>
      )}

      {/* Guardian access */}
      <div>
        <GuardianAccessToggle
          initialEnabled={profile.guardianAccess}
          initialSlug={profile.guardianSlug}
          baseUrl={baseUrl}
        />
      </div>
    </div>
  );
}
