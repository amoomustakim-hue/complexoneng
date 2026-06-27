import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({ where: { clerkUserId: userId } });
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const body = await req.json();
  const { itemType, itemId } = body as { itemType?: "INVENTORY" | "HOSTEL"; itemId?: string };

  if (!itemType || !itemId || !["INVENTORY", "HOSTEL"].includes(itemType)) {
    return NextResponse.json({ error: "Invalid item" }, { status: 400 });
  }

  let itemName: string;
  let amount: number;

  if (itemType === "INVENTORY") {
    const item = await prisma.inventoryItem.findUnique({ where: { id: itemId } });
    if (!item || item.stock <= 0) {
      return NextResponse.json({ error: "Item not available" }, { status: 404 });
    }
    itemName = item.name;
    amount = item.price;
  } else {
    const hostel = await prisma.hostel.findUnique({ where: { id: itemId } });
    if (!hostel || hostel.roomsAvailable <= 0) {
      return NextResponse.json({ error: "Hostel not available" }, { status: 404 });
    }
    itemName = hostel.name;
    amount = hostel.deposit;
  }

  const order = await prisma.order.create({
    data: {
      profileId: profile.id,
      itemType,
      itemId,
      itemName,
      amount,
    },
  });

  const origin = new URL(req.url).origin;

  try {
    const transaction = await initializeTransaction({
      email: profile.email,
      amountKobo: amount * 100,
      reference: order.id,
      callbackUrl: `${origin}/economy/checkout/callback`,
      metadata: { orderId: order.id, itemType, itemId },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paystackRef: transaction.reference },
    });

    return NextResponse.json({ authorizationUrl: transaction.authorization_url, orderId: order.id });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "Checkout is unavailable right now (payments aren't configured yet). Your order was saved as pending.",
        orderId: order.id,
        detail: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 502 }
    );
  }
}
