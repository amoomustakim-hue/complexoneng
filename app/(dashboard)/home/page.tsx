import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getCurrentProfile } from "@/lib/profile";
import { isAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import HighSchoolHome from "@/components/dashboard/home/HighSchoolHome";
import UndergradHome from "@/components/dashboard/home/UndergradHome";
import ResearcherHome from "@/components/dashboard/home/ResearcherHome";
import JambHome from "@/components/dashboard/home/JambHome";

export default async function HomePage() {
  const { userId } = await auth();
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  // Admin users go straight to the admin panel (DB flag, ADMIN_EMAILS, or ADMIN_CLERK_USER_IDS)
  if (profile.isAdmin || isAdminUser(profile.email, userId ?? undefined)) {
    redirect("/admin");
  }

  const firstName = profile.fullName?.split(" ")[0] ?? "";

  if (profile.track === "RESEARCHER") {
    return (
      <ResearcherHome
        firstName={firstName}
        researchArea={profile.researchArea}
        researchStage={profile.researchStage}
      />
    );
  }

  if (profile.track === "HIGH_SCHOOL") {
    const sessions = await prisma.cbtSession.findMany({ where: { profileId: profile.id } });
    const attempts = sessions.length;
    const avgScore = attempts
      ? Math.round((sessions.reduce((acc, s) => acc + s.score / s.total, 0) / attempts) * 100)
      : 0;

    // JAMB candidates get a dedicated home with UTME countdown + subject picker
    if (profile.level === "JAMB") {
      return (
        <JambHome
          firstName={firstName}
          attempts={attempts}
          avgScore={avgScore}
        />
      );
    }

    return (
      <HighSchoolHome
        firstName={firstName}
        targetExam={profile.targetExam}
        attempts={attempts}
        avgScore={avgScore}
      />
    );
  }

  const enrolledCount = await prisma.enrollment.count({ where: { profileId: profile.id } });

  return (
    <UndergradHome
      firstName={firstName}
      courseOfStudy={profile.courseOfStudy}
      points={profile.points}
      streak={profile.currentStreak}
      enrolledCourses={enrolledCount}
    />
  );
}
