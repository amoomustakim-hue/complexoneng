import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCoachSession } from "@/lib/coach";
import { getLessonHelperModel } from "@/lib/gemini";
import { getAiRatelimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; content: string };

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const limiter = getAiRatelimit();
  if (limiter) {
    const { success, reset } = await limiter.limit(userId);
    if (!success) {
      return new Response("Too many requests. Try again in a minute.", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
      });
    }
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const { id: lessonId } = await params;
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) {
    return new Response("Lesson not found", { status: 404 });
  }

  const { message } = (await req.json()) as { message: string };
  if (!message?.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  const context = `lesson:${lessonId}`;
  const session = await getOrCreateCoachSession(profile.id, context);
  const history = (session.messages as ChatMessage[]) ?? [];

  const model = getLessonHelperModel(lesson.title, lesson.textContent ?? "");
  const chat = model.startChat({
    history: history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
  });

  const result = await chat.sendMessageStream(message);

  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullResponse += text;
          controller.enqueue(new TextEncoder().encode(text));
        }
      } catch (err) {
        controller.error(err);
        return;
      }

      await prisma.coachSession.update({
        where: { id: session.id },
        data: {
          messages: [
            ...history,
            { role: "user", content: message },
            { role: "model", content: fullResponse },
          ],
        },
      });

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
