"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_MODULES, getNavOrder, type Track } from "@/lib/dashboard-nav";

export default function BottomNav({ track }: { track?: Track }) {
  const pathname = usePathname();
  const order = getNavOrder(track);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border-light flex justify-around py-2">
      {order.map((key) => {
        const m = NAV_MODULES[key];
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
