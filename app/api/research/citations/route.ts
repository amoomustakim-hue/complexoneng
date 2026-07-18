import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCitationModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Record<string, string | undefined>;
  const { style, sourceType, author, title, year } = body;

  if (!style || !author || !title || !year) {
    return NextResponse.json({ error: "Author, title, year, and style are required" }, { status: 400 });
  }

  const fields: string[] = [
    `Citation style: ${style}`,
    `Source type: ${sourceType ?? "unknown"}`,
    `Author(s): ${author}`,
    `Title: ${title}`,
    `Year: ${year}`,
    body.journal     ? `Journal: ${body.journal}` : null,
    body.volume      ? `Volume: ${body.volume}` : null,
    body.issue       ? `Issue: ${body.issue}` : null,
    body.pages       ? `Pages: ${body.pages}` : null,
    body.doi         ? `DOI/URL: ${body.doi}` : null,
    body.publisher   ? `Publisher: ${body.publisher}` : null,
    body.edition     ? `Edition: ${body.edition}` : null,
    body.siteName    ? `Website name: ${body.siteName}` : null,
    body.url         ? `URL: ${body.url}` : null,
    body.accessDate  ? `Date accessed: ${body.accessDate}` : null,
    body.institution ? `Institution: ${body.institution}` : null,
    body.reportType  ? `Report type: ${body.reportType}` : null,
  ].filter(Boolean) as string[];

  const prompt = `You are a citation formatter. Return ONLY the formatted citation — no explanation, no prefix, no surrounding text.

Format this source as a ${style} citation:

${fields.join("\n")}`;

  try {
    const model = getCitationModel();
    const result = await model.generateContent(prompt);
    return NextResponse.json({ citation: result.response.text().trim() });
  } catch {
    return NextResponse.json({ error: "Citation generation failed. Try again." }, { status: 502 });
  }
}
