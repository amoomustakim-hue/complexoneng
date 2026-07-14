import { prisma } from "@/lib/prisma";
import QuestionBankAdmin from "@/components/admin/QuestionBankAdmin";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ examType?: string; subject?: string }>;
}) {
  const { examType, subject } = await searchParams;

  const questions = await prisma.question.findMany({
    where: {
      ...(examType && { examType: examType as never }),
      ...(subject && { subject: { contains: subject, mode: "insensitive" } }),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">CBT question bank</h1>
      <QuestionBankAdmin
        initialQuestions={questions.map((q) => ({
          id: q.id,
          examType: q.examType,
          subject: q.subject,
          year: q.year,
          question: q.question,
          options: q.options as string[],
          answer: q.answer,
          explanation: q.explanation,
        }))}
        initialExamType={examType ?? ""}
        initialSubject={subject ?? ""}
      />
    </div>
  );
}
