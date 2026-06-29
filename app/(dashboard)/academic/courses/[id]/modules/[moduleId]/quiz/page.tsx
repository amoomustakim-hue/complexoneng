import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import ModuleQuiz from "@/components/academic/ModuleQuiz";

export default async function ModuleQuizPage({
  params,
}: {
  params: Promise<{ id: string; moduleId: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const { id: courseId, moduleId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  if (!course) {
    notFound();
  }

  const moduleIndex = course.modules.findIndex((m) => m.id === moduleId);
  if (moduleIndex === -1) {
    notFound();
  }

  const currentModule = course.modules[moduleIndex];
  const nextModule = course.modules[moduleIndex + 1];

  const continueHref = nextModule
    ? `/academic/courses/${course.id}?lesson=${nextModule.lessons[0]?.id ?? ""}`
    : "/academic";
  const continueLabel = nextModule ? "Continue to next topic" : "Back to overview";

  return (
    <ModuleQuiz
      moduleId={currentModule.id}
      moduleTitle={currentModule.title}
      continueHref={continueHref}
      continueLabel={continueLabel}
    />
  );
}
