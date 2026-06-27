import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Reference is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: reference } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "PENDING") {
    return NextResponse.json({ order });
  }

  try {
    const transaction = await verifyTransaction(reference);
    if (transaction.status === "success") {
      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" },
      });
      return NextResponse.json({ order: updated });
    }
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json(
      { error: "Could not verify payment", detail: err instanceof Error ? err.message : "Unknown error" },
      { status: 502 }
    );
  }
}
