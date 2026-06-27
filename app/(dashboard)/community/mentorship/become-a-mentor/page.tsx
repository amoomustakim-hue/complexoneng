import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import BecomeMentorForm from "@/components/community/BecomeMentorForm";

export default async function BecomeMentorPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">MENTORSHIP NETWORK</p>
      <h1 className="text-2xl font-bold text-teal mt-1">
        {profile.isMentor ? "Update your mentor profile" : "Become a mentor"}
      </h1>
      <p className="text-sm text-muted mt-1">
        Share your expertise and help other students with career, academic, or life guidance.
      </p>

      <BecomeMentorForm
        initialBio={profile.mentorBio ?? ""}
        initialExpertise={profile.mentorExpertise ?? ""}
      />
    </div>
  );
}
