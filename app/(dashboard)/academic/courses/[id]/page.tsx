import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PlayCircle, FileText, CheckCircle2, Circle } from "lucide-react";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";
import MarkCompleteButton from "@/components/academic/MarkCompleteButton";
import EnrollButton from "@/components/academic/EnrollButton";
import LessonSidePanel from "@/components/academic/LessonSidePanel";
import { getOrCreateCoachSession } from "@/lib/coach";

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const { id } = await params;
  const { lesson: lessonIdParam } = await searchParams;

  const course = await prisma.course.findUnique({
    where: { id },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  });

  if (!course) {
    notFound();
  }

  const allLessons = course.modules.flatMap((m) => m.lessons);
  if (allLessons.length === 0) {
    notFound();
  }

  const currentLesson = lessonIdParam
    ? allLessons.find((l) => l.id === lessonIdParam) ?? allLessons[0]
    : allLessons[0];

  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const currentModule = course.modules.find((m) => m.lessons.some((l) => l.id === currentLesson.id))!;
  const isLastLessonInModule =
    currentModule.lessons[currentModule.lessons.length - 1]?.id === currentLesson.id;

  const enrollment = await prisma.enrollment.findUnique({
    where: { profileId_courseId: { profileId: profile.id, courseId: id } },
  });
  const progress = await prisma.lessonProgress.findMany({
    where: { profileId: profile.id, lessonId: { in: allLessons.map((l) => l.id) } },
  });
  const completedSet = new Set(progress.map((p) => p.lessonId));

  const [aiSession, note, questions] = await Promise.all([
    getOrCreateCoachSession(profile.id, `lesson:${currentLesson.id}`),
    prisma.lessonNote.findUnique({
      where: { profileId_lessonId: { profileId: profile.id, lessonId: currentLesson.id } },
    }),
    prisma.lessonQuestion.findMany({
      where: { lessonId: currentLesson.id },
      orderBy: { createdAt: "desc" },
      include: { profile: true, answers: { include: { profile: true }, orderBy: { createdAt: "asc" } } },
    }),
  ]);

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="md:w-64 shrink-0 border-r border-border-light bg-white">
        <div className="p-4 border-b border-border-light">
          <p className="text-xs text-muted">{course.levelTag}</p>
          <h1 className="font-bold text-teal text-sm mt-0.5">{course.title}</h1>
          {!enrollment && (
            <div className="mt-2">
              <EnrollButton courseId={course.id} initialEnrolled={false} />
            </div>
          )}
        </div>
        <div className="p-2 max-h-[70vh] overflow-y-auto">
          {course.modules.map((module_) => (
            <div key={module_.id} className="mb-2">
              <p className="text-xs font-semibold text-muted px-2 py-1">{module_.title}</p>
              {module_.lessons.map((lesson) => {
                const active = lesson.id === currentLesson.id;
                const done = completedSet.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={`/academic/courses/${course.id}?lesson=${lesson.id}`}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm ${
                      active ? "bg-cream text-teal font-semibold" : "text-muted hover:bg-cream/60"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 size={14} className="text-teal shrink-0" />
                    ) : (
                      <Circle size={14} className="shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 min-w-0 px-6 py-8 max-w-2xl">
        <p className="text-xs tracking-widest text-teal">
          {currentLesson.contentType === "VIDEO" ? "VIDEO LESSON" : "TEXT LESSON"}
        </p>
        <h2 className="text-2xl font-bold text-teal mt-1">{currentLesson.title}</h2>

        {currentLesson.videoUrl ? (
          <div className="aspect-video bg-teal-deep rounded-xl mt-4 flex items-center justify-center">
            <iframe
              src={currentLesson.videoUrl}
              className="w-full h-full rounded-xl"
              allowFullScreen
              title={currentLesson.title}
            />
          </div>
        ) : (
          <div className="aspect-video bg-cream border border-dashed border-border-light rounded-xl mt-4 flex flex-col items-center justify-center gap-2 text-center px-6">
            <PlayCircle className="text-muted" size={28} />
            <p className="text-sm text-muted">Video coming soon — your instructor hasn&apos;t uploaded one yet.</p>
          </div>
        )}

        <div className="flex items-start gap-2 mt-6">
          <FileText className="text-teal shrink-0 mt-0.5" size={16} />
          <p className="text-sm text-muted">{currentLesson.textContent}</p>
        </div>

        <div className="flex items-center justify-between mt-8">
          <MarkCompleteButton
            lessonId={currentLesson.id}
            initialCompleted={completedSet.has(currentLesson.id)}
          />
          <div className="flex gap-2">
            {prevLesson && (
              <Link
                href={`/academic/courses/${course.id}?lesson=${prevLesson.id}`}
                className="text-sm font-semibold text-teal border border-border-light px-4 py-2 rounded-lg"
              >
                ← Previous
              </Link>
            )}
            {isLastLessonInModule ? (
              <Link
                href={`/academic/courses/${course.id}/modules/${currentModule.id}/quiz`}
                className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
              >
                Take quick check →
              </Link>
            ) : (
              nextLesson && (
                <Link
                  href={`/academic/courses/${course.id}?lesson=${nextLesson.id}`}
                  className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
                >
                  Next →
                </Link>
              )
            )}
          </div>
        </div>

        <LessonSidePanel
          lessonId={currentLesson.id}
          currentProfileId={profile.id}
          initialAiMessages={(aiSession.messages as { role: "user" | "model"; content: string }[]) ?? []}
          initialNoteContent={note?.content ?? ""}
          initialQuestions={questions.map((q) => ({
            id: q.id,
            content: q.content,
            profileId: q.profileId,
            profile: { fullName: q.profile.fullName, email: q.profile.email },
            answers: q.answers.map((a) => ({
              id: a.id,
              content: a.content,
              isBest: a.isBest,
              profile: { fullName: a.profile.fullName, email: a.profile.email },
            })),
          }))}
        />
      </div>
    </div>
  );
}
