import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import ResearchMarketplace from "@/components/research/ResearchMarketplace";

export default async function ResearchMarketplacePage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const [open, mine, myOffers] = await Promise.all([
    prisma.researchRequest.findMany({
      where: { status: "OPEN", profileId: { not: profile.id } },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { offers: true } } },
    }),
    prisma.researchRequest.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      include: {
        offers: { orderBy: { createdAt: "desc" }, include: { profile: true } },
      },
    }),
    prisma.researchOffer.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: "desc" },
      include: { request: true },
    }),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">RESEARCH MARKETPLACE</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Get help, or offer it</h1>
      <p className="text-sm text-muted mt-1">
        Connect with analysts, statisticians, and fellow researchers.
      </p>

      <div className="mt-6">
        <ResearchMarketplace
          initialOpen={open.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            skillsNeeded: r.skillsNeeded,
            budget: r.budget,
            _count: r._count,
          }))}
          initialMine={mine.map((r) => ({
            id: r.id,
            title: r.title,
            description: r.description,
            status: r.status,
            offers: r.offers.map((o) => ({
              id: o.id,
              message: o.message,
              status: o.status,
              createdAt: o.createdAt.toISOString(),
              profile: { fullName: o.profile.fullName, email: o.profile.email },
            })),
          }))}
          initialMyOffers={myOffers.map((o) => ({
            id: o.id,
            message: o.message,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            request: {
              id: o.request.id,
              title: o.request.title,
              status: o.request.status,
            },
          }))}
        />
      </div>
    </div>
  );
}
