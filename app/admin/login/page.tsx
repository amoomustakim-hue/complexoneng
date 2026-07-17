import { redirect } from "next/navigation";
import { isAdminCookieValid, isAdminClerkUser } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const isAdmin = await isAdminClerkUser();
  if (!isAdmin) redirect("/home");

  const valid = isAdminCookieValid();
  if (valid) redirect("/admin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-full max-w-sm mx-auto px-6">
        <p className="text-xs tracking-widest text-teal mb-2">COMPLEXONE</p>
        <h1 className="text-2xl font-bold text-teal mb-8">Admin portal</h1>
        <AdminLoginForm />
      </div>
    </div>
  );
}
