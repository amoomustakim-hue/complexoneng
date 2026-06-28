import Link from "next/link";
import { Users, UserCheck } from "lucide-react";

const modules = [
  {
    href: "/community/communities",
    icon: Users,
    title: "Communities",
    body: "Join student communities by interest and join the conversation.",
  },
  {
    href: "/community/mentorship",
    icon: UserCheck,
    title: "Mentorship Network",
    body: "Connect with graduates, lecturers, and professionals for guidance.",
  },
];

export default function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">COMMUNITY & MENTORSHIP</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Connect and grow together</h1>

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
