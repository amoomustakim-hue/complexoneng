import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdminProfile } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await requireAdminProfile();
  if (!profile) {
    redirect("/home");
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <Link href="/admin" className="text-sm font-semibold text-teal">
          Admin
        </Link>
        <Link href="/admin/courses" className="text-sm text-muted hover:text-teal">
          Courses
        </Link>
        <Link href="/admin/questions" className="text-sm text-muted hover:text-teal">
          Questions
        </Link>
        <Link href="/admin/opportunities" className="text-sm text-muted hover:text-teal">
          Opportunities
        </Link>
        <Link href="/admin/programs" className="text-sm text-muted hover:text-teal">
          Programs
        </Link>
        <Link href="/admin/inventory" className="text-sm text-muted hover:text-teal">
          Inventory
        </Link>
        <Link href="/admin/hostels" className="text-sm text-muted hover:text-teal">
          Hostels
        </Link>
        <Link href="/admin/orders" className="text-sm text-muted hover:text-teal">
          Orders
        </Link>
        <Link href="/admin/mentors" className="text-sm text-muted hover:text-teal">
          Mentors
        </Link>
      </div>
      {children}
    </div>
  );
}
