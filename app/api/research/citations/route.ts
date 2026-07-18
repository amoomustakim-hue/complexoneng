import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCitationModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as Record<string, string | undefined>;
  const { style, query, sourceType, author, title, year } = body;

  if (!style) {
    return NextResponse.json({ error: "Style is required" }, { status: 400 });
  }

  let prompt: string;

  if (query) {
    // Auto-search mode: user typed a URL, DOI, title, or keywords
    prompt = `You are a citation formatter. The user wants to cite a source. They provided this search query: "${query}"

This could be a URL, DOI, ISBN, title, or keywords. Infer what the source is and generate a properly formatted ${style} citation for it.

Return ONLY the formatted citation — no explanation, no prefix, no surrounding text. If you cannot determine enough information to cite it, return your best attempt based on what's available.`;
  } else {
    // Manual mode
    if (!author || !title || !year) {
      return NextResponse.json({ error: "Author, title, and year are required" }, { status: 400 });
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

    prompt = `You are a citation formatter. Return ONLY the formatted citation — no explanation, no prefix, no surrounding text.

Format this source as a ${style} citation:

${fields.join("\n")}`;
  }

  try {
    const model = getCitationModel();
    const result = await model.generateContent(prompt);
    return NextResponse.json({ citation: result.response.text().trim() });
  } catch {
    return NextResponse.json({ error: "Citation generation failed. Try again." }, { status: 502 });
  }
}
