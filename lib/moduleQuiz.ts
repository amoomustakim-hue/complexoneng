import { prisma } from "@/lib/prisma";
import { getQuizGeneratorModel } from "@/lib/gemini";

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

function isValidQuiz(value: unknown): value is QuizQuestion[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every(
      (q) =>
        q &&
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length >= 2 &&
        typeof q.answer === "string" &&
        typeof q.explanation === "string"
    )
  );
}

async function generateQuiz(moduleTitle: string, lessonTitles: string[]): Promise<QuizQuestion[]> {
  const model = getQuizGeneratorModel();

  const prompt =
    `Topic: "${moduleTitle}"\n` +
    `Lessons covered: ${lessonTitles.join(", ")}\n\n` +
    "Write exactly 4 multiple-choice questions checking understanding of this topic. " +
    'Respond with ONLY a JSON array, each item shaped as: ' +
    '{"question": string, "options": [string, string, string, string], "answer": string (must exactly match one option), "explanation": string}.';

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);

  if (!isValidQuiz(parsed)) {
    throw new Error("Generated quiz did not match the expected shape");
  }

  return parsed;
}

export async function getOrGenerateModuleQuiz(moduleId: string): Promise<QuizQuestion[]> {
  const module_ = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!module_) {
    throw new Error("Module not found");
  }

  if (module_.quizQuestions) {
    const cached = module_.quizQuestions as unknown;
    if (isValidQuiz(cached)) {
      return cached;
    }
  }

  const quiz = await generateQuiz(module_.title, module_.lessons.map((l) => l.title));

  await prisma.module.update({
    where: { id: moduleId },
    data: { quizQuestions: quiz },
  });

  return quiz;
}
