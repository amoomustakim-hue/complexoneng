import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getOrGenerateModuleQuiz } from "@/lib/moduleQuiz";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const quiz = await getOrGenerateModuleQuiz(id);
    return NextResponse.json({ quiz });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Couldn't generate a quiz for this topic right now.",
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
