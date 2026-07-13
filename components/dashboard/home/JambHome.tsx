import Link from "next/link";
import {
  BookOpen,
  Sparkles,
  Clock,
  TrendingUp,
  BarChart2,
  Target,
  ChevronRight,
} from "lucide-react";

// JAMB typically holds exams in Feb/March each year
function getJambCountdown(): { days: number; label: string } {
  const now = new Date();
  const year = now.getFullYear();

  // Target: March 15 as a representative date
  let target = new Date(`${year}-03-15`);
  if (now >= target) {
    // Past this year's exam → count to next year's
    target = new Date(`${year + 1}-03-15`);
  }

  const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return { days, label: `${target.toLocaleString("en-NG", { month: "long", year: "numeric" })} UTME` };
}

const JAMB_SUBJECTS = [
  { label: "Use of English", required: true, href: "/academic/cbt?subject=English" },
  { label: "Mathematics", required: false, href: "/academic/cbt?subject=Mathematics" },
  { label: "Biology", required: false, href: "/academic/cbt?subject=Biology" },
  { label: "Chemistry", required: false, href: "/academic/cbt?subject=Chemistry" },
  { label: "Physics", required: false, href: "/academic/cbt?subject=Physics" },
  { label: "Economics", required: false, href: "/academic/cbt?subject=Economics" },
  { label: "Government", required: false, href: "/academic/cbt?subject=Government" },
  { label: "Literature", required: false, href: "/academic/cbt?subject=Literature" },
];

const secondaryLinks = [
  { href: "/career", icon: Target, title: "Course & University Guide" },
  { href: "/community", icon: TrendingUp, title: "JAMB Candidates Forum" },
];

export default function JambHome({
  firstName,
  attempts,
  avgScore,
}: {
  firstName: string;
  attempts: number;
  avgScore: number;
}) {
  const { days, label } = getJambCountdown();
  const urgency = days <= 30 ? "text-red-600" : days <= 90 ? "text-amber-600" : "text-teal";

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <p className="text-xs tracking-widest text-teal">
        {firstName ? `HI, ${firstName.toUpperCase()}` : "WELCOME"}
      </p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        UTME prep dashboard
      </h1>

      {/* Countdown + Score bar */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl border border-border-light bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Clock size={14} />
            <span className="text-xs font-medium">Countdown</span>
          </div>
          <p className={`text-3xl font-black ${urgency}`}>{days}</p>
          <p className="text-xs text-muted mt-0.5">days to {label}</p>
        </div>

        <div className="rounded-xl border border-border-light bg-white p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <BarChart2 size={14} />
            <span className="text-xs font-medium">Your average</span>
          </div>
          <p className="text-3xl font-black text-teal">
            {attempts > 0 ? `${avgScore}%` : "—"}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {attempts > 0
              ? `across ${attempts} practice session${attempts === 1 ? "" : "s"}`
              : "No sessions yet"}
          </p>
        </div>
      </div>

      {/* Score progress bar */}
      {attempts > 0 && (
        <div className="mt-3 rounded-xl border border-border-light bg-white px-4 py-3">
          <div className="flex justify-between text-xs text-muted mb-2">
            <span>Progress toward 280+ target</span>
            <span className={avgScore >= 70 ? "text-green-600 font-semibold" : "text-amber-600 font-semibold"}>
              {avgScore >= 70 ? "On track ✓" : "Needs work"}
            </span>
          </div>
          <div className="h-2 bg-border-light rounded-full overflow-hidden">
            <div
              className="h-full bg-teal rounded-full transition-all"
              style={{ width: `${Math.min(avgScore, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Primary actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link
          href="/academic/cbt"
          className="rounded-xl bg-teal text-cream p-6 flex flex-col justify-between hover:bg-teal-light transition-colors"
        >
          <div>
            <BookOpen size={22} />
            <p className="font-bold mt-3">Practice a full UTME mock</p>
            <p className="text-sm opacity-75 mt-1">
              {attempts > 0
                ? `${attempts} session${attempts === 1 ? "" : "s"} done · ${avgScore}% avg`
                : "Start your first timed CBT session"}
            </p>
          </div>
          <span className="text-sm font-semibold mt-4">Start mock exam →</span>
        </Link>

        <Link
          href="/academic/coach"
          className="rounded-xl border border-border-light bg-white p-6 flex flex-col justify-between hover:border-teal transition"
        >
          <div>
            <Sparkles size={22} className="text-teal" />
            <p className="font-bold text-teal mt-3">Ask your JAMB AI coach</p>
            <p className="text-sm text-muted mt-1">
              Get subject explanations, study plans, and exam strategies tailored for UTME.
            </p>
          </div>
          <span className="text-sm font-semibold text-teal mt-4">Open coach →</span>
        </Link>
      </div>

      <Link href="/academic" className="block text-sm text-teal underline mt-3">
        View full performance dashboard →
      </Link>

      {/* Practice by subject */}
      <div className="mt-8">
        <p className="text-xs tracking-widest text-muted">PRACTICE BY SUBJECT</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
          {JAMB_SUBJECTS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="flex items-center justify-between rounded-xl border border-border-light bg-white px-4 py-3 hover:border-teal transition group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-teal">{s.label}</span>
                {s.required && (
                  <span className="text-[10px] font-semibold bg-teal/10 text-teal px-1.5 py-0.5 rounded-full">
                    Compulsory
                  </span>
                )}
              </div>
              <ChevronRight size={15} className="text-muted group-hover:text-teal transition" />
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary links */}
      <p className="text-xs tracking-widest text-muted mt-8">MORE FOR YOU</p>
      <div className="grid grid-cols-2 gap-3 mt-3">
        {secondaryLinks.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-border-light bg-white p-4 hover:border-teal transition flex flex-col items-center text-center gap-2"
            >
              <Icon className="text-teal" size={20} />
              <p className="text-xs font-medium text-teal">{m.title}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
