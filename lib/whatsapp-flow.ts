import { prisma } from "@/lib/prisma";
import { getOrCreateWaSession, setWaSession, type WaContext } from "@/lib/wa-session";
import { initializeTransaction } from "@/lib/paystack";

const MAIN_MENU =
  "Welcome to ComplexOne Marketplace 🎓\nWhat are you looking for today?\n" +
  "1. Textbooks & notes\n2. Laptops & devices\n3. Academic materials\n4. Hostel bookings\n" +
  "Reply with a number, or just tell me what you need.";

const HELP_TEXT =
  "Commands:\nMENU or 0 - main menu\nBACK - go back a step\nORDER STATUS - check your last order\n" +
  "TALK TO ADMIN - speak to a human";

type Candidate = { id: string; label: string };

async function classifyIntent(text: string): Promise<"textbooks" | "laptops" | "materials" | "hostels" | null> {
  const lower = text.toLowerCase();
  if (lower.includes("textbook") || lower.includes("book")) return "textbooks";
  if (lower.includes("laptop") || lower.includes("computer") || lower.includes("device")) return "laptops";
  if (lower.includes("material") || lower.includes("past question") || lower.includes("note")) return "materials";
  if (lower.includes("hostel") || lower.includes("accommodation") || lower.includes("room")) return "hostels";

  try {
    const { getCoachModel } = await import("@/lib/gemini");
    const model = getCoachModel();
    const result = await model.generateContent(
      `Classify this WhatsApp message into exactly one word: textbooks, laptops, materials, hostels, or none.\nMessage: "${text}"\nReply with only the single word.`
    );
    const word = result.response.text().trim().toLowerCase();
    if (["textbooks", "laptops", "materials", "hostels"].includes(word)) {
      return word as "textbooks" | "laptops" | "materials" | "hostels";
    }
  } catch {
    // Gemini unavailable — fall through to null
  }

  return null;
}

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function listCandidates(prefix: string, candidates: Candidate[]) {
  const lines = candidates.map((c, i) => `${i + 1}. ${c.label}`);
  return `${prefix}\n${lines.join("\n")}\nReply with a number for full details.`;
}

async function handleGlobalCommand(phone: string, text: string): Promise<string | null> {
  const upper = text.trim().toUpperCase();

  if (upper === "MENU" || upper === "0") {
    await setWaSession(phone, "main_menu");
    return MAIN_MENU;
  }
  if (upper === "HELP") {
    return HELP_TEXT;
  }
  if (upper === "ORDER STATUS") {
    const order = await prisma.order.findFirst({
      where: { studentPhone: phone },
      orderBy: { createdAt: "desc" },
    });
    if (!order) return "You don't have any orders yet. Reply MENU to start shopping.";
    return `Last order: ${order.itemName}\nStatus: ${order.status}\nAmount: ${formatNaira(order.amount)}`;
  }
  if (upper === "TALK TO ADMIN") {
    return "We've notified an admin. Someone will reach out to you here on WhatsApp shortly.";
  }

  return null;
}

export async function handleIncomingMessage(phone: string, text: string): Promise<string> {
  const session = await getOrCreateWaSession(phone);

  const globalReply = await handleGlobalCommand(phone, text);
  if (globalReply) return globalReply;

  const context = (session.context as WaContext) ?? {};
  const trimmed = text.trim();

  switch (session.state) {
    case "idle":
    case "main_menu": {
      let intent: "textbooks" | "laptops" | "materials" | "hostels" | null = null;
      if (trimmed === "1") intent = "textbooks";
      else if (trimmed === "2") intent = "laptops";
      else if (trimmed === "3") intent = "materials";
      else if (trimmed === "4") intent = "hostels";
      else intent = await classifyIntent(trimmed);

      if (intent === "textbooks") {
        await setWaSession(phone, "browsing_textbooks");
        return "What subject or title are you looking for? e.g. Zoology, MTH101, Organic Chemistry";
      }
      if (intent === "laptops") {
        await setWaSession(phone, "browsing_laptops");
        return "What is your budget range?\n1. Under ₦100,000\n2. ₦100,000 - ₦200,000\n3. Above ₦200,000\n4. Show all laptops";
      }
      if (intent === "materials") {
        const items = await prisma.inventoryItem.findMany({
          where: { category: "ACADEMIC_MATERIAL" },
          take: 8,
        });
        if (items.length === 0) return "No academic materials available right now. Reply MENU for other options.";
        const candidates: Candidate[] = items.map((i) => ({
          id: i.id,
          label: `${i.name} — ${formatNaira(i.price)}`,
        }));
        await setWaSession(phone, "browsing_materials", { candidates, itemType: "INVENTORY" });
        return listCandidates("Academic materials available:", candidates);
      }
      if (intent === "hostels") {
        const hostels = await prisma.hostel.findMany();
        const areas = Array.from(new Set(hostels.map((h) => h.area)));
        if (areas.length === 0) return "No hostels listed right now. Reply MENU for other options.";
        const candidates: Candidate[] = areas.map((a, i) => ({ id: String(i), label: a }));
        await setWaSession(phone, "browsing_hostels_area", { candidates, areas });
        return listCandidates("Which area are you looking in?", candidates);
      }

      return MAIN_MENU;
    }

    case "browsing_textbooks": {
      const items = await prisma.inventoryItem.findMany({
        where: { category: "TEXTBOOK", name: { contains: trimmed, mode: "insensitive" } },
        take: 8,
      });
      if (items.length === 0) {
        return `No textbooks found for "${trimmed}". Try another subject, or reply MENU.`;
      }
      const candidates: Candidate[] = items.map((i) => ({
        id: i.id,
        label: `${i.name} — ${formatNaira(i.price)} (${i.condition ?? "Good"})`,
      }));
      await setWaSession(phone, "viewing_candidates", { candidates, itemType: "INVENTORY" });
      return listCandidates(`Found ${items.length} textbook(s):`, candidates);
    }

    case "browsing_laptops": {
      const where: { category: "LAPTOP"; price?: { lt?: number; gte?: number; lte?: number; gt?: number } } = {
        category: "LAPTOP",
      };
      if (trimmed === "1") where.price = { lt: 100000 };
      else if (trimmed === "2") where.price = { gte: 100000, lte: 200000 };
      else if (trimmed === "3") where.price = { gt: 200000 };

      const items = await prisma.inventoryItem.findMany({ where, take: 8 });
      if (items.length === 0) return "No laptops found in that range. Reply MENU to try again.";
      const candidates: Candidate[] = items.map((i) => ({
        id: i.id,
        label: `${i.name} — ${formatNaira(i.price)} (${i.condition ?? "Good"})`,
      }));
      await setWaSession(phone, "viewing_candidates", { candidates, itemType: "INVENTORY" });
      return listCandidates("Laptops matching your budget:", candidates);
    }

    case "browsing_hostels_area": {
      const candidates = (context.candidates as Candidate[]) ?? [];
      const choice = candidates[Number(trimmed) - 1];
      if (!choice) return "Please reply with a valid number from the list, or MENU to start over.";

      const hostels = await prisma.hostel.findMany({ where: { area: choice.label }, take: 8 });
      if (hostels.length === 0) return "No hostels found in that area. Reply MENU to try again.";
      const hostelCandidates: Candidate[] = hostels.map((h) => ({
        id: h.id,
        label: `${h.name} — ${formatNaira(h.pricePerYear)}/yr (${h.type === "OWNED" ? "ComplexOne owned" : "Verified partner"})`,
      }));
      await setWaSession(phone, "viewing_candidates", { candidates: hostelCandidates, itemType: "HOSTEL" });
      return listCandidates(`Hostels in ${choice.label}:`, hostelCandidates);
    }

    case "browsing_materials":
    case "viewing_candidates": {
      const candidates = (context.candidates as Candidate[]) ?? [];
      const itemType = (context.itemType as "INVENTORY" | "HOSTEL") ?? "INVENTORY";
      const choice = candidates[Number(trimmed) - 1];
      if (!choice) return "Please reply with a valid number from the list, or MENU to start over.";

      await setWaSession(phone, "viewing_item", { itemId: choice.id, itemType, label: choice.label });
      return `${choice.label}\nReply PAY to order, or BACK for the list again.`;
    }

    case "viewing_item": {
      const upper = trimmed.toUpperCase();
      if (upper === "BACK") {
        await setWaSession(phone, "main_menu");
        return MAIN_MENU;
      }
      if (upper === "PAY") {
        const itemId = context.itemId as string;
        const itemType = context.itemType as "INVENTORY" | "HOSTEL";
        const label = context.label as string;

        let amount: number;
        let itemName: string;

        if (itemType === "INVENTORY") {
          const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
          if (!item) return "Sorry, that item is no longer available. Reply MENU to start over.";
          amount = item.price;
          itemName = item.name;
        } else {
          const hostel = await prisma.hostel.findUnique({ where: { id: itemId } });
          if (!hostel) return "Sorry, that hostel is no longer available. Reply MENU to start over.";
          amount = hostel.deposit;
          itemName = hostel.name;
        }

        const order = await prisma.order.create({
          data: { studentPhone: phone, itemType, itemId, itemName, amount },
        });

        try {
          const transaction = await initializeTransaction({
            email: `${phone}@whatsapp.complexone.ng`,
            amountKobo: amount * 100,
            reference: order.id,
            callbackUrl: "https://complexone.ng/economy/checkout/callback",
          });
          await prisma.order.update({ where: { id: order.id }, data: { paystackRef: transaction.reference } });
          await setWaSession(phone, "awaiting_payment", { orderId: order.id });
          return `Complete your payment here:\n👉 ${transaction.authorization_url}\nSecured by Paystack. Card, USSD, bank transfer.`;
        } catch {
          await setWaSession(phone, "awaiting_payment", { orderId: order.id });
          return `Thanks! Your order for ${label} has been recorded. Payment links aren't active yet — an admin will reach out to arrange payment.`;
        }
      }
      return "Reply PAY to order, or BACK to see the list again.";
    }

    case "awaiting_payment": {
      return "Your order is pending payment confirmation. Reply ORDER STATUS to check, or MENU to start over.";
    }

    default: {
      await setWaSession(phone, "main_menu");
      return MAIN_MENU;
    }
  }
}
