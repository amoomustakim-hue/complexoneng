import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrGenerateModuleQuiz, getAdaptiveModuleQuiz } from "@/lib/moduleQuiz";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const retake = new URL(req.url).searchParams.get("retake") === "true";

  try {
    if (retake) {
      const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
      if (!profile) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      const { quiz, isAdaptive } = await getAdaptiveModuleQuiz(profile.id, id);
      return NextResponse.json({ quiz, isAdaptive });
    }

    const quiz = await getOrGenerateModuleQuiz(id);
    return NextResponse.json({ quiz, isAdaptive: false });
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
