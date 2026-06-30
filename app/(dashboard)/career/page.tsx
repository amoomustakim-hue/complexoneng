import { redirect } from "next/navigation";
import Link from "next/link";
import { Compass, Award, GraduationCap, CalendarClock, Briefcase, FileText } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import { CAREER_INFO, type CareerCategory } from "@/lib/career-quiz";

export default async function CareerPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/sign-in");

  const now = new Date();

  const [latestResult, appCount, nextApp] = await Promise.all([
    prisma.careerResult.findFirst({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.universityApplication.count({ where: { profileId: profile.id } }),
    prisma.universityApplication.findFirst({
      where: { profileId: profile.id, deadline: { gte: now } },
      orderBy: { deadline: "asc" },
    }),
  ]);

  const topMatch =
    latestResult && Array.isArray(latestResult.topMatches) && latestResult.topMatches.length > 0
      ? CAREER_INFO[(latestResult.topMatches as { category: CareerCategory }[])[0].category]?.label
      : null;

  const nextDeadline = nextApp?.deadline
    ? nextApp.deadline.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : null;

  const stats = [
    {
      label: "Top career match",
      value: topMatch ?? "Take the quiz",
      sub: topMatch ? "From your last quiz" : "Discover your path",
      href: "/career/quiz",
    },
    {
      label: "Applications tracked",
      value: appCount > 0 ? String(appCount) : "None yet",
      sub: appCount > 0 ? `${appCount} programme${appCount === 1 ? "" : "s"}` : "Start tracking",
      href: "/career/admissions",
    },
    {
      label: "Next deadline",
      value: nextDeadline ?? "None set",
      sub: nextApp ? nextApp.universityName : "Add an application",
      href: "/career/admissions",
    },
  ];

  const modules = [
    {
      href: "/career/quiz",
      icon: Compass,
      title: "Career Discovery",
      body: "Answer a few questions to find career paths that fit you.",
      cta: latestResult ? "Retake quiz" : "Start quiz",
    },
    {
      href: "/career/scholarships",
      icon: Award,
      title: "Scholarships & Opportunities",
      body: "Scholarships, fellowships, competitions, and internships.",
      cta: "Browse opportunities",
    },
    {
      href: "/career/admissions",
      icon: GraduationCap,
      title: "University Admission Navigator",
      body: "Browse programs and track your applications on a Kanban board.",
      cta: appCount > 0 ? `${appCount} tracked` : "Add an application",
    },
    {
      href: "/career/internships",
      icon: Briefcase,
      title: "Internship Opportunities",
      body: "Browse vetted internships with AI-match badges and industry filters.",
      cta: "Find internships",
    },
    {
      href: "/career/internships/tracker",
      icon: Briefcase,
      title: "Internship Tracker",
      body: "Log your internship applications and track them through Applied → Interview → Offer.",
      cta: "Track applications",
    },
    {
      href: "/career/cv-builder",
      icon: FileText,
      title: "CV & Cover Letter Generator",
      body: "Get a tailored professional summary and cover letter for your internship applications.",
      cta: "Generate now",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-10">
      <div>
        <p className="text-xs tracking-widest text-teal">CAREER & FUTURE PLANNING</p>
        <h1 className="text-2xl font-bold text-teal mt-1">Your career hub</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-xl bg-white p-5 hover:border-teal border border-border-light transition"
            style={{ boxShadow: "20px 20px 60px rgba(8,32,25,0.08), -8px -8px 30px rgba(255,255,255,0.7)" }}
          >
            <p className="text-xs text-muted tracking-wide">{s.label}</p>
            <p className="text-xl font-bold text-teal mt-1 leading-tight break-words">{s.value}</p>
            <p className="text-xs text-muted mt-1">{s.sub}</p>
          </Link>
        ))}
      </div>

      {nextDeadline && (() => {
        const days = Math.ceil((nextApp!.deadline!.getTime() - now.getTime()) / 86_400_000);
        if (days > 30) return null;
        return (
          <div className={`rounded-xl border px-5 py-3 flex items-center gap-3 ${days < 7 ? "border-red-300 bg-red-50" : "border-amber-300 bg-amber-50"}`}>
            <CalendarClock size={18} className={days < 7 ? "text-red-600" : "text-amber-600"} />
            <p className="text-sm font-medium text-teal">
              <span className={days < 7 ? "text-red-600" : "text-amber-600"}>
                {days < 7 ? "Closing soon" : "Ends soon"}:
              </span>{" "}
              {nextApp!.universityName} — {nextApp!.program} ({nextDeadline})
            </p>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition flex flex-col justify-between gap-4"
            >
              <div>
                <Icon className="text-teal" size={22} />
                <h2 className="font-bold text-teal mt-3">{m.title}</h2>
                <p className="text-sm text-muted mt-1">{m.body}</p>
              </div>
              <span className="text-sm font-semibold text-teal">{m.cta} →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
