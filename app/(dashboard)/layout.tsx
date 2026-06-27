import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomNav from "@/components/dashboard/BottomNav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (!profile.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-cream">
      <DashboardHeader />
      <main className="pb-20">{children}</main>
      <BottomNav />
    </div>
  );
}
