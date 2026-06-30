import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import InternshipList from "@/components/career/InternshipList";
import { CAREER_INFO, type CareerCategory } from "@/lib/career-quiz";

export default async function InternshipsPage() {
  const profile = await getCurrentProfile();

  const [internships, latestResult] = await Promise.all([
    prisma.opportunity.findMany({
      where: { type: "INTERNSHIP" },
      orderBy: { deadline: "asc" },
    }),
    profile
      ? prisma.careerResult.findFirst({
          where: { profileId: profile.id },
          orderBy: { createdAt: "desc" },
        })
      : Promise.resolve(null),
  ]);

  const matchedCategory =
    latestResult && Array.isArray(latestResult.topMatches) && latestResult.topMatches.length > 0
      ? CAREER_INFO[(latestResult.topMatches as { category: CareerCategory }[])[0].category]?.label ?? null
      : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">INTERNSHIP PLACEMENT</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Internship opportunities</h1>
      <p className="text-sm text-muted mt-1">
        Vetted internships for Nigerian students — search, filter, and apply.
      </p>

      <div className="mt-6">
        <InternshipList
          internships={internships.map((i) => ({
            id: i.id,
            title: i.title,
            provider: i.provider,
            description: i.description,
            eligibility: i.eligibility,
            deadline: i.deadline?.toISOString() ?? null,
            link: i.link,
            category: i.category,
          }))}
          matchedCategory={matchedCategory}
        />
      </div>
    </div>
  );
}
