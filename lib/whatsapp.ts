const GRAPH_API_BASE = "https://graph.facebook.com/v19.0";

export async function sendWhatsAppMessage(to: string, text: string) {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID ?? "";
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN ?? "";

  const res = await fetch(`${GRAPH_API_BASE}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`WhatsApp send failed: ${res.status} ${detail}`);
  }

  return res.json();
}

export function verifyWebhookChallenge(mode: string | null, token: string | null) {
  return mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN;
}
