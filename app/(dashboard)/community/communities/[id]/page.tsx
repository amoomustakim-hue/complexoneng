import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import CommunityDetail from "@/components/community/CommunityDetail";

const CATEGORY_LABELS: Record<string, string> = {
  JAMB_CANDIDATES: "JAMB candidates",
  UNIVERSITY_STUDENTS: "University students",
  SUBJECT_ENTHUSIASTS: "Subject enthusiasts",
  ENTREPRENEURS: "Entrepreneurs",
};

export default async function CommunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const community = await prisma.community.findUnique({
    where: { id },
    include: {
      _count: { select: { memberships: true } },
      memberships: { where: { profileId: profile.id } },
      posts: { orderBy: { createdAt: "desc" }, include: { profile: true }, take: 50 },
    },
  });

  if (!community) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">{CATEGORY_LABELS[community.category]}</p>
      <h1 className="text-2xl font-bold text-teal mt-1">{community.name}</h1>
      <p className="text-sm text-muted mt-1">{community.description}</p>

      <div className="mt-6">
        <CommunityDetail
          communityId={community.id}
          initialJoined={community.memberships.length > 0}
          memberCount={community._count.memberships}
          initialPosts={community.posts.map((p) => ({
            id: p.id,
            content: p.content,
            createdAt: p.createdAt.toISOString(),
            profile: { fullName: p.profile.fullName, email: p.profile.email },
          }))}
        />
      </div>
    </div>
  );
}
