import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getCitationModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { style, author, title, year, publisher, url, journal, volume, issue, pages } =
    (await req.json()) as {
      style: string;
      author: string;
      title: string;
      year: string;
      publisher?: string;
      url?: string;
      journal?: string;
      volume?: string;
      issue?: string;
      pages?: string;
    };

  if (!style || !author || !title || !year) {
    return NextResponse.json({ error: "Author, title, year, and style are required" }, { status: 400 });
  }

  const sourceDetails = [
    `Style: ${style}`,
    `Author(s): ${author}`,
    `Title: ${title}`,
    `Year: ${year}`,
    publisher ? `Publisher: ${publisher}` : null,
    journal ? `Journal: ${journal}` : null,
    volume ? `Volume: ${volume}` : null,
    issue ? `Issue: ${issue}` : null,
    pages ? `Pages: ${pages}` : null,
    url ? `URL: ${url}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const prompt = `Format the following source as a ${style} citation:\n${sourceDetails}`;

  try {
    const model = getCitationModel();
    const result = await model.generateContent(prompt);
    return NextResponse.json({ citation: result.response.text().trim() });
  } catch {
    return NextResponse.json({ error: "Citation generation failed. Try again." }, { status: 502 });
  }
}
