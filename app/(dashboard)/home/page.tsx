import Link from "next/link";
import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users, IdCard } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";

const modules = [
  {
    href: "/academic/dashboard",
    icon: BookOpen,
    title: "Academic Success Hub",
    body: "AI coach, CBT practice, and your performance dashboard.",
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

export default async function HomePage() {
  const profile = await getCurrentProfile();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">WELCOME BACK</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {profile?.fullName ? `Hi, ${profile.fullName.split(" ")[0]}` : "Hi there"}
      </h1>

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
