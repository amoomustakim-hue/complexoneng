import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border-light h-14 flex items-center justify-between px-6">
      <Link href="/home" className="font-bold text-teal text-lg">
        ComplexOne
      </Link>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
