import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import MentorBrowser from "@/components/community/MentorBrowser";

export default async function MentorshipPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const mentors = await prisma.profile.findMany({
    where: { isMentor: true, id: { not: profile.id } },
    select: { id: true, fullName: true, email: true, mentorBio: true, mentorExpertise: true },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs tracking-widest text-teal">MENTORSHIP NETWORK</p>
          <h1 className="text-2xl font-bold text-teal mt-1">Find a mentor</h1>
        </div>
        <div className="flex gap-2">
          <Link
            href="/community/mentorship/requests"
            className="text-sm font-semibold text-teal border border-border-light px-4 py-2 rounded-lg"
          >
            My requests
          </Link>
          <Link
            href="/community/mentorship/become-a-mentor"
            className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
          >
            {profile.isMentor ? "Edit mentor profile" : "Become a mentor"}
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <MentorBrowser mentors={mentors} />
      </div>
    </div>
  );
}
