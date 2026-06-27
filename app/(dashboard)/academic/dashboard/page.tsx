import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import PerformanceChart from "@/components/academic/PerformanceChart";

export default async function AcademicDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const sessions = await prisma.cbtSession.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "asc" },
  });

  const totalAttempts = sessions.length;
  const avgScore = totalAttempts
    ? Math.round(
        (sessions.reduce((acc, s) => acc + s.score / s.total, 0) / totalAttempts) * 100
      )
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">ACADEMIC SUCCESS HUB</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Your performance</h1>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white border border-border-light rounded-xl p-5">
          <p className="text-xs text-muted">CBT attempts</p>
          <p className="text-2xl font-bold text-teal mt-1">{totalAttempts}</p>
        </div>
        <div className="bg-white border border-border-light rounded-xl p-5">
          <p className="text-xs text-muted">Average score</p>
          <p className="text-2xl font-bold text-teal mt-1">{avgScore}%</p>
        </div>
      </div>

      <div className="bg-white border border-border-light rounded-xl p-6 mt-6">
        <h2 className="font-bold text-teal mb-4">Scores over time</h2>
        <PerformanceChart
          sessions={sessions.map((s) => ({
            id: s.id,
            subject: s.subject,
            score: s.score,
            total: s.total,
            createdAt: s.createdAt.toISOString(),
          }))}
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Link
          href="/academic/cbt"
          className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg"
        >
          Practice CBT
        </Link>
        <Link
          href="/academic/coach"
          className="border border-teal text-teal font-semibold px-6 py-3 rounded-lg"
        >
          Talk to AI coach
        </Link>
      </div>
    </div>
  );
}
