"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users } from "lucide-react";

type Track = "HIGH_SCHOOL" | "UNDERGRAD" | "RESEARCHER" | null | undefined;

const modules = {
  academic: { href: "/academic/dashboard", label: "Academic", icon: BookOpen },
  career: { href: "/career", label: "Career", icon: Briefcase },
  research: { href: "/research", label: "Research", icon: FlaskConical },
  economy: { href: "/economy", label: "Economy", icon: ShoppingBag },
  community: { href: "/community", label: "Community", icon: Users },
};

const ORDER_BY_TRACK: Record<string, (keyof typeof modules)[]> = {
  HIGH_SCHOOL: ["academic", "career", "economy", "community", "research"],
  UNDERGRAD: ["academic", "career", "research", "economy", "community"],
  RESEARCHER: ["research", "community", "career", "economy", "academic"],
};

export default function BottomNav({ track }: { track?: Track }) {
  const pathname = usePathname();
  const order = ORDER_BY_TRACK[track ?? ""] ?? ORDER_BY_TRACK.UNDERGRAD;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-light flex justify-around py-2">
      {order.map((key) => {
        const m = modules[key];
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
