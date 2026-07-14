import { prisma } from "@/lib/prisma";
import MentorApplicationAdmin from "@/components/admin/MentorApplicationAdmin";

export default async function AdminMentorsPage() {
  const applications = await prisma.mentorApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Mentor applications</h1>
      <MentorApplicationAdmin
        initialApplications={applications.map((a) => ({
          id: a.id,
          fullName: a.fullName,
          email: a.email,
          whatsapp: a.whatsapp,
          expertise: a.expertise,
          bio: a.bio,
          linkedin: a.linkedin,
          status: a.status,
          createdAt: a.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
