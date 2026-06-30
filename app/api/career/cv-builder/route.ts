import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCVBuilderModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { course, year, skills, role, achievements } = (await req.json()) as {
    course: string;
    year: string;
    skills: string;
    role: string;
    achievements?: string;
  };

  if (!course || !year || !skills || !role) {
    return NextResponse.json({ error: "Course, year, skills, and target role are required" }, { status: 400 });
  }

  const prompt =
    `Student Details:\n` +
    `Course of Study: ${course}\n` +
    `Year / Level: ${year}\n` +
    `Skills: ${skills}\n` +
    `Target Internship Role: ${role}\n` +
    (achievements ? `Notable Achievements: ${achievements}\n` : "") +
    `\nWrite a Professional Summary (3 sentences) and a Cover Letter Opening Paragraph (4-6 sentences).`;

  try {
    const model = getCVBuilderModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text) as { summary: string; coverLetter: string };
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Generation failed. Try again." }, { status: 502 });
  }
}
