import { NextResponse } from "next/server";
import { verifyWebhookChallenge, sendWhatsAppMessage } from "@/lib/whatsapp";
import { handleIncomingMessage } from "@/lib/whatsapp-flow";

export const runtime = "nodejs";

// Meta calls this once to verify the webhook URL when you configure it
// in the WhatsApp Business API dashboard.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (verifyWebhookChallenge(mode, token)) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

type WhatsAppWebhookPayload = {
  entry?: {
    changes?: {
      value?: {
        messages?: { from: string; text?: { body: string }; type: string }[];
      };
    }[];
  }[];
};

export async function POST(req: Request) {
  const payload = (await req.json()) as WhatsAppWebhookPayload;

  const message = payload.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  // Acknowledge immediately even if there's nothing to process — Meta
  // expects a fast 200 regardless of message content.
  if (!message || message.type !== "text" || !message.text?.body) {
    return NextResponse.json({ received: true });
  }

  const phone = message.from;
  const text = message.text.body;

  try {
    const reply = await handleIncomingMessage(phone, text);
    await sendWhatsAppMessage(phone, reply);
  } catch (err) {
    // WhatsApp Business API isn't configured yet (placeholder credentials) —
    // the conversation state machine still ran and updated WaSession; we just
    // can't deliver the reply until real credentials are in place.
    console.error("WhatsApp send failed:", err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ received: true });
}
