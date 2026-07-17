import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import BottomNav from "@/components/dashboard/BottomNav";
import WaveBackground from "@/components/dashboard/WaveBackground";

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
    <div className="min-h-screen bg-cream relative">
      <WaveBackground />
      <div className="relative z-10">
        <DashboardHeader track={profile.track} />
        <main className="pb-20 md:pb-0">{children}</main>
        <BottomNav track={profile.track} />
      </div>
    </div>
  );
}
