import { redirect } from "next/navigation";
import { getOrCreateProfile } from "@/lib/profile";
import OnboardingForm from "@/components/onboarding/OnboardingForm";

export default async function OnboardingPage() {
  const profile = await getOrCreateProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  if (profile.onboarded) {
    redirect("/academic/dashboard");
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bg-white border border-border-light rounded-xl p-8">
        <p className="text-xs tracking-widest text-teal">GET STARTED</p>
        <h1 className="text-2xl font-bold text-teal mt-2">Tell us about yourself</h1>
        <p className="text-sm text-muted mt-1">
          This helps us tailor your CBT practice and AI coach to your level.
        </p>
        <OnboardingForm />
      </div>
    </div>
  );
}
