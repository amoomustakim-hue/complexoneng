import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProposalDraftModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, background, questions, objectives, methodology, significance } =
    (await req.json()) as {
      title: string;
      background: string;
      questions: string;
      objectives: string;
      methodology: string;
      significance: string;
    };

  if (!title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const prompt =
    `Research Proposal Inputs:\n` +
    `Title: ${title}\n` +
    `Background / Problem Statement: ${background}\n` +
    `Research Questions: ${questions}\n` +
    `Objectives: ${objectives}\n` +
    `Methodology: ${methodology}\n` +
    `Significance of Study: ${significance}\n\n` +
    `Draft a structured academic research proposal using the sections above.`;

  try {
    const model = getProposalDraftModel();
    const result = await model.generateContent(prompt);
    return NextResponse.json({ draft: result.response.text() });
  } catch {
    return NextResponse.json({ error: "AI draft failed. Try again." }, { status: 502 });
  }
}
