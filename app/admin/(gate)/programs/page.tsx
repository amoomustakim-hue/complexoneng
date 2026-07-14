import { prisma } from "@/lib/prisma";
import UniversityProgramAdmin from "@/components/admin/UniversityProgramAdmin";

export default async function AdminProgramsPage() {
  const programs = await prisma.universityProgram.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">University programs</h1>
      <UniversityProgramAdmin
        initialPrograms={programs.map((p) => ({
          id: p.id,
          name: p.name,
          country: p.country,
          program: p.program,
          requirements: p.requirements,
          link: p.link,
        }))}
      />
    </div>
  );
}
