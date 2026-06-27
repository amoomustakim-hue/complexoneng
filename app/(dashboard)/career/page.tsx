import Link from "next/link";
import { Compass, Award, GraduationCap } from "lucide-react";

const modules = [
  {
    href: "/career/quiz",
    icon: Compass,
    title: "Career Discovery",
    body: "Answer a few questions to find career paths that fit you.",
  },
  {
    href: "/career/scholarships",
    icon: Award,
    title: "Scholarships & Opportunities",
    body: "Scholarships, fellowships, competitions, and internships.",
  },
  {
    href: "/career/admissions",
    icon: GraduationCap,
    title: "University Admission Navigator",
    body: "Browse programs and track your applications.",
  },
];

export default function CareerPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">CAREER & FUTURE PLANNING</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Plan your future</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.href}
              href={m.href}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
            >
              <Icon className="text-teal" size={22} />
              <h2 className="font-bold text-teal mt-3">{m.title}</h2>
              <p className="text-sm text-muted mt-1">{m.body}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
