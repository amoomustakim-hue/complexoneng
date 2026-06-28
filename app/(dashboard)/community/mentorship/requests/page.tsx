import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import MentorshipRequests from "@/components/community/MentorshipRequests";

export default async function MentorshipRequestsPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const [sent, received] = await Promise.all([
    prisma.mentorshipRequest.findMany({
      where: { studentId: profile.id },
      orderBy: { createdAt: "desc" },
      include: { mentor: true },
    }),
    profile.isMentor
      ? prisma.mentorshipRequest.findMany({
          where: { mentorId: profile.id },
          orderBy: { createdAt: "desc" },
          include: { student: true },
        })
      : Promise.resolve([]),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">MENTORSHIP NETWORK</p>
      <h1 className="text-2xl font-bold text-teal mt-1">My mentorship requests</h1>

      <div className="mt-6">
        <MentorshipRequests
          isMentor={profile.isMentor}
          initialSent={sent.map((r) => ({
            id: r.id,
            message: r.message,
            preferredTopic: r.preferredTopic,
            status: r.status,
            mentor: { fullName: r.mentor.fullName, email: r.mentor.email },
          }))}
          initialReceived={received.map((r) => ({
            id: r.id,
            message: r.message,
            preferredTopic: r.preferredTopic,
            status: r.status,
            student: { fullName: r.student.fullName, email: r.student.email },
          }))}
        />
      </div>
    </div>
  );
}
