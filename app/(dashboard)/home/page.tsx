import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import HighSchoolHome from "@/components/dashboard/home/HighSchoolHome";
import UndergradHome from "@/components/dashboard/home/UndergradHome";
import ResearcherHome from "@/components/dashboard/home/ResearcherHome";
import JambHome from "@/components/dashboard/home/JambHome";

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
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
