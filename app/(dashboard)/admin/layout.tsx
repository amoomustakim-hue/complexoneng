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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin" className="text-sm font-semibold text-teal">
          Admin
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
