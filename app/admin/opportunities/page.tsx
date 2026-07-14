import { prisma } from "@/lib/prisma";
import OpportunityAdmin from "@/components/admin/OpportunityAdmin";

export default async function AdminOpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Scholarships & opportunities</h1>
      <OpportunityAdmin
        initialOpportunities={opportunities.map((o) => ({
          id: o.id,
          title: o.title,
          provider: o.provider,
          type: o.type,
          category: o.category,
          description: o.description,
          eligibility: o.eligibility,
          deadline: o.deadline ? o.deadline.toISOString().slice(0, 10) : null,
          link: o.link,
          level: o.level,
        }))}
      />
    </div>
  );
}
