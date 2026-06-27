import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  FULFILLED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

export default async function OrdersPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const orders = await prisma.order.findMany({
    where: { profileId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <p className="text-xs tracking-widest text-teal">STUDENT ECONOMY</p>
      <h1 className="text-2xl font-bold text-teal mt-1">My orders</h1>

      <div className="flex flex-col gap-3 mt-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-xl border border-border-light bg-white p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-bold text-teal">{order.itemName}</p>
              <p className="text-xs text-muted mt-0.5">
                {order.itemType === "HOSTEL" ? "Hostel booking" : "Purchase"} ·{" "}
                {formatNaira(order.amount)}
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </span>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-sm text-muted text-center py-12">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
