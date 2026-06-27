"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users } from "lucide-react";

const modules = [
  { href: "/academic/dashboard", label: "Academic", icon: BookOpen },
  { href: "/career", label: "Career", icon: Briefcase },
  { href: "/research", label: "Research", icon: FlaskConical },
  { href: "/economy", label: "Economy", icon: ShoppingBag },
  { href: "/community", label: "Community", icon: Users },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-light flex justify-around py-2">
      {modules.map((m) => {
        const Icon = m.icon;
        const active = pathname?.startsWith(m.href);
        return (
          <Link
            key={m.href}
            href={m.href}
            className={`flex flex-col items-center gap-1 px-3 py-1 text-xs ${
              active ? "text-teal font-semibold" : "text-muted"
            }`}
          >
            <Icon size={20} />
            {m.label}
          </Link>
        );
      })}
    </nav>
  );
}
