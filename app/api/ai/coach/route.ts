import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCoachSession } from "@/lib/coach";
import { getCoachModel } from "@/lib/gemini";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "model"; content: string };

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return new Response("Profile not found", { status: 404 });
  }

  const { message } = (await req.json()) as { message: string };
  if (!message?.trim()) {
    return new Response("Message is required", { status: 400 });
  }

  const session = await getOrCreateCoachSession(profile.id);
  const history = (session.messages as ChatMessage[]) ?? [];

  const model = getCoachModel();
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
