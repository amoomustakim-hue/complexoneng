import Link from "next/link";
import { BookOpen, Sparkles, Briefcase, ShoppingBag, Users, IdCard } from "lucide-react";

const EXAM_LABELS: Record<string, string> = {
  JAMB: "JAMB",
  WAEC: "WAEC",
  NECO: "NECO",
  POST_UTME: "Post-UTME",
};

const secondaryModules = [
  { href: "/career", icon: Briefcase, title: "Career & Future Planning" },
  { href: "/economy", icon: ShoppingBag, title: "Student Economy" },
  { href: "/community", icon: Users, title: "Community & Mentorship" },
  { href: "/portfolio", icon: IdCard, title: "Digital Portfolio" },
];

export default function HighSchoolHome({
  firstName,
  targetExam,
  attempts,
  avgScore,
}: {
  firstName: string;
  targetExam?: string | null;
  attempts: number;
  avgScore: number;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">{firstName ? `HI, ${firstName.toUpperCase()}` : "WELCOME"}</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {targetExam ? `Let's get you ready for ${EXAM_LABELS[targetExam] ?? targetExam}` : "Let's get you exam-ready"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Link
          href="/academic/cbt"
          className="rounded-xl bg-teal text-cream p-6 flex flex-col justify-between"
        >
          <div>
            <BookOpen size={22} />
            <p className="font-bold mt-3">Practice a mock exam</p>
            <p className="text-sm opacity-75 mt-1">
              {attempts > 0
                ? `${attempts} attempt${attempts === 1 ? "" : "s"} so far · ${avgScore}% average`
                : "Start your first CBT practice session"}
            </p>
          </div>
          <span className="text-sm font-semibold mt-4">Start practice →</span>
        </Link>

        <Link
          href="/academic/coach"
          className="rounded-xl border border-border-light bg-white p-6 flex flex-col justify-between hover:border-teal transition"
        >
          <div>
            <Sparkles size={22} className="text-teal" />
            <p className="font-bold text-teal mt-3">Ask your AI coach</p>
            <p className="text-sm text-muted mt-1">
              Get a study plan, subject help, or exam strategy.
            </p>
          </div>
          <span className="text-sm font-semibold text-teal mt-4">Open coach →</span>
        </Link>
      </div>

      <Link
        href="/academic"
        className="block text-sm text-teal underline mt-4"
      >
        View your full performance dashboard →
      </Link>

      <p className="text-xs tracking-widest text-muted mt-10">MORE FOR YOU</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
        {secondaryModules.map((m) => {
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
