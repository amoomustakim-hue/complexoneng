import { prisma } from "@/lib/prisma";
import OpportunityList from "@/components/career/OpportunityList";

export default async function ScholarshipsPage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { deadline: "asc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">SCHOLARSHIPS & OPPORTUNITIES</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Find your next opportunity</h1>
      <p className="text-sm text-muted mt-1">
        Scholarships, fellowships, competitions, and internships, all in one place.
      </p>

      <div className="mt-6">
        <OpportunityList
          opportunities={opportunities.map((o) => ({
            id: o.id,
            title: o.title,
            provider: o.provider,
            type: o.type,
            description: o.description,
            eligibility: o.eligibility,
            deadline: o.deadline?.toISOString() ?? null,
            link: o.link,
          }))}
        />
      </div>
    </div>
  );
}
