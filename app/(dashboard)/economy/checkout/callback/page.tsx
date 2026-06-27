import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifyTransaction } from "@/lib/paystack";

export default async function CheckoutCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;

  if (!reference) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-sm text-muted">No payment reference found.</p>
      </div>
    );
  }

  const order = await prisma.order.findUnique({ where: { id: reference } });

  let status = order?.status ?? "PENDING";

  if (order && order.status === "PENDING") {
    try {
      const transaction = await verifyTransaction(reference);
      if (transaction.status === "success") {
        await prisma.order.update({ where: { id: order.id }, data: { status: "PAID" } });
        status = "PAID";
      }
    } catch {
      // Paystack not configured yet — order stays pending
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 text-center">
      {status === "PAID" ? (
        <>
          <p className="text-xs tracking-widest text-teal">PAYMENT CONFIRMED</p>
          <h1 className="text-2xl font-bold text-teal mt-2">You&apos;re all set</h1>
          <p className="text-sm text-muted mt-1">
            {order?.itemName} — payment received. We&apos;ll be in touch about fulfillment.
          </p>
        </>
      ) : (
        <>
          <p className="text-xs tracking-widest text-teal">PAYMENT PENDING</p>
          <h1 className="text-2xl font-bold text-teal mt-2">We couldn&apos;t confirm payment yet</h1>
          <p className="text-sm text-muted mt-1">
            Your order is saved. If you completed payment, it may take a moment to reflect.
          </p>
        </>
      )}
      <Link
        href="/economy/orders"
        className="inline-block bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-6"
      >
        View my orders
      </Link>
    </div>
  );
}
