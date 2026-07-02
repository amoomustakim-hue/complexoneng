import Link from "next/link";
import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users, IdCard, Flame, Star } from "lucide-react";

const modules = [
  {
    href: "/academic",
    icon: BookOpen,
    title: "Academic Success Hub",
    body: "Courses, AI coach, CBT practice, and your performance dashboard.",
  },
  {
    href: "/career",
    icon: Briefcase,
    title: "Career & Future Planning",
    body: "Career discovery, scholarships, and admissions.",
  },
  {
    href: "/research",
    icon: FlaskConical,
    title: "Research Support",
    body: "Proposal guidance and the research marketplace.",
  },
  {
    href: "/economy",
    icon: ShoppingBag,
    title: "Student Economy",
    body: "Textbooks, laptops, and verified hostels.",
  },
  {
    href: "/community",
    icon: Users,
    title: "Community & Mentorship",
    body: "Communities and mentorship sessions.",
  },
  {
    href: "/portfolio",
    icon: IdCard,
    title: "Digital Portfolio",
    body: "Your verified academic profile.",
  },
];

export default function UndergradHome({
  firstName,
  courseOfStudy,
  points,
  streak,
  enrolledCourses,
}: {
  firstName: string;
  courseOfStudy?: string | null;
  points: number;
  streak: number;
  enrolledCourses: number;
}) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">WELCOME BACK</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {firstName ? `Hi, ${firstName}` : "Hi there"}
      </h1>
      {courseOfStudy && <p className="text-sm text-muted mt-1">{courseOfStudy}</p>}

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-teal">
          <Star size={15} className="text-lime fill-lime" />
          {points.toLocaleString()} pts
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold text-teal">
          <Flame size={15} className="text-orange-400" />
          {streak}-day streak
        </span>
        {enrolledCourses > 0 && (
          <Link href="/academic/courses" className="flex items-center gap-1.5 text-sm font-semibold text-teal hover:text-lime transition-colors">
            <BookOpen size={15} />
            {enrolledCourses} course{enrolledCourses === 1 ? "" : "s"} enrolled
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
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
