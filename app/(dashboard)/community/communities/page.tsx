import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

const CATEGORY_LABELS: Record<string, string> = {
  JAMB_CANDIDATES: "JAMB candidates",
  UNIVERSITY_STUDENTS: "University students",
  SUBJECT_ENTHUSIASTS: "Subject enthusiasts",
  ENTREPRENEURS: "Entrepreneurs",
};

export default async function CommunitiesPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const communities = await prisma.community.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { memberships: true } },
      memberships: { where: { profileId: profile.id } },
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">COMMUNITIES</p>
      <h1 className="text-2xl font-bold text-teal mt-1">Find your people</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {communities.map((c) => {
          const joined = c.memberships.length > 0;
          return (
            <Link
              key={c.id}
              href={`/community/communities/${c.id}`}
              className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
            >
              <span className="text-xs bg-cream text-teal font-medium px-2 py-0.5 rounded-full">
                {CATEGORY_LABELS[c.category]}
              </span>
              <h2 className="font-bold text-teal mt-2">{c.name}</h2>
              <p className="text-sm text-muted mt-1">{c.description}</p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-muted">{c._count.memberships} members</p>
                {joined && <span className="text-xs font-semibold text-teal">Joined ✓</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
