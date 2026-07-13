"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { NAV_MODULES, getNavOrder, type Track } from "@/lib/dashboard-nav";
import SignOutButton from "@/components/dashboard/SignOutButton";

export default function DashboardHeader({ track }: { track?: Track }) {
  const pathname = usePathname();
  const order = getNavOrder(track);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-light h-14 flex items-center justify-between px-6 gap-6">
      <Link href="/home" className="font-bold text-teal text-lg shrink-0">
        ComplexOne
      </Link>

      <nav className="hidden md:flex items-center gap-6 flex-1">
        {order.map((key) => {
          const m = NAV_MODULES[key];
          const active = pathname?.startsWith(m.href);
          return (
            <Link
              key={m.href}
              href={m.href}
              className={`text-sm transition-colors ${
                active ? "text-teal font-semibold" : "text-muted hover:text-teal"
              }`}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <SignOutButton />
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  );
}
