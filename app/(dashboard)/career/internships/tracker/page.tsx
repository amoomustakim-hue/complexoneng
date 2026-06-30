import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import InternshipTracker from "@/components/career/InternshipTracker";

export default async function InternshipTrackerPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/sign-in");

  const applications = await prisma.internshipApplication.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs tracking-widest text-teal">INTERNSHIP PLACEMENT</p>
          <h1 className="text-2xl font-bold text-teal mt-1">My internship applications</h1>
          <p className="text-sm text-muted mt-1">Track every application from first contact to offer.</p>
        </div>
        <Link
          href="/career/internships"
          className="shrink-0 text-sm font-semibold text-teal border border-teal px-4 py-2 rounded-lg hover:bg-cream transition"
        >
          Browse internships
        </Link>
      </div>

      <div className="mt-6">
        <InternshipTracker
          initialApplications={applications.map((a) => ({
            id: a.id,
            company: a.company,
            role: a.role,
            industry: a.industry,
            location: a.location,
            status: a.status,
            deadline: a.deadline?.toISOString() ?? null,
          }))}
        />
      </div>
    </div>
  );
}
