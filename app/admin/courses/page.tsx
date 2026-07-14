import { prisma } from "@/lib/prisma";
import CourseListAdmin from "@/components/admin/CourseListAdmin";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: [{ subject: "asc" }, { order: "asc" }],
    include: { _count: { select: { modules: true, enrollments: true } } },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Courses</h1>
      <CourseListAdmin
        initialCourses={courses.map((c) => ({
          id: c.id,
          subject: c.subject,
          title: c.title,
          levelTag: c.levelTag,
          description: c.description,
          order: c.order,
          moduleCount: c._count.modules,
          enrollmentCount: c._count.enrollments,
        }))}
      />
    </div>
  );
}
