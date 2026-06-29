"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, ClipboardList, Sparkles, LineChart, Map } from "lucide-react";

const links = [
  { href: "/academic", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/academic/courses", label: "My Courses", icon: BookOpen },
  { href: "/academic/mastery", label: "Mastery Map", icon: Map },
  { href: "/academic/cbt", label: "CBT Practice", icon: ClipboardList },
  { href: "/academic/coach", label: "AI Coach", icon: Sparkles },
  { href: "/academic/dashboard", label: "Performance", icon: LineChart },
];

export default function AcademicSidebar() {
  const pathname = usePathname();

  return (
    <nav className="md:w-56 shrink-0 md:border-r border-border-light bg-white">
      <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition ${
                active ? "bg-teal text-cream font-semibold" : "text-muted hover:bg-cream"
              }`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
