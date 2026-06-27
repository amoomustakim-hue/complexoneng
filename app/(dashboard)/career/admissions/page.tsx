import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import AdmissionTracker from "@/components/career/AdmissionTracker";

export default async function AdmissionsPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const [programs, applications] = await Promise.all([
    prisma.universityProgram.findMany({ orderBy: { name: "asc" } }),
    prisma.universityApplication.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">UNIVERSITY ADMISSION NAVIGATOR</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Track your applications</h1>
      <p className="text-sm text-muted mt-1">
        Browse Nigerian and international programs, and track where you stand in each application.
      </p>

      <div className="mt-6">
        <AdmissionTracker
          programs={programs.map((p) => ({
            id: p.id,
            name: p.name,
            country: p.country,
            program: p.program,
            requirements: p.requirements,
            link: p.link,
          }))}
          initialApplications={applications.map((a) => ({
            id: a.id,
            universityName: a.universityName,
            country: a.country,
            program: a.program,
            status: a.status,
            deadline: a.deadline?.toISOString() ?? null,
          }))}
        />
      </div>
    </div>
  );
}
