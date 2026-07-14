import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminCookieValid, isAdminClerkUser } from "@/lib/admin-auth";
import AdminSignOutButton from "@/components/admin/AdminSignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await isAdminClerkUser();
  if (!isAdmin) redirect("/home");

  const valid = await isAdminCookieValid();
  if (!valid) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-border-light bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Link href="/admin" className="text-sm font-bold text-teal shrink-0">
            ComplexOne Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/admin/courses" className="text-xs font-medium text-muted hover:text-teal transition-colors">Courses</Link>
            <Link href="/admin/questions" className="text-xs font-medium text-muted hover:text-teal transition-colors">Questions</Link>
            <Link href="/admin/opportunities" className="text-xs font-medium text-muted hover:text-teal transition-colors">Opportunities</Link>
            <Link href="/admin/programs" className="text-xs font-medium text-muted hover:text-teal transition-colors">Programs</Link>
            <Link href="/admin/inventory" className="text-xs font-medium text-muted hover:text-teal transition-colors">Inventory</Link>
            <Link href="/admin/hostels" className="text-xs font-medium text-muted hover:text-teal transition-colors">Hostels</Link>
            <Link href="/admin/orders" className="text-xs font-medium text-muted hover:text-teal transition-colors">Orders</Link>
            <Link href="/admin/mentors" className="text-xs font-medium text-muted hover:text-teal transition-colors">Mentors</Link>
          </nav>
        </div>
        <AdminSignOutButton />
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
