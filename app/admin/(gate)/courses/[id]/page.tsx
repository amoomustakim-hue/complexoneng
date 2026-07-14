import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseDetailAdmin from "@/components/admin/CourseDetailAdmin";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  });

  if (!course) {
    notFound();
  }

  return (
    <div>
      <p className="text-xs text-muted">{course.subject} · {course.levelTag}</p>
      <h1 className="text-xl font-bold text-teal mb-4">{course.title}</h1>
      <CourseDetailAdmin
        courseId={course.id}
        initialModules={course.modules.map((m) => ({
          id: m.id,
          title: m.title,
          order: m.order,
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            order: l.order,
            contentType: l.contentType,
            textContent: l.textContent,
            videoUrl: l.videoUrl,
            pdfUrl: l.pdfUrl,
          })),
        }))}
      />
    </div>
  );
}
