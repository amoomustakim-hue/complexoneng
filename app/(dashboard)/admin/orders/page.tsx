import { prisma } from "@/lib/prisma";
import OrdersAdmin from "@/components/admin/OrdersAdmin";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: true },
  });

  return (
    <div>
      <h1 className="text-xl font-bold text-teal mb-4">Orders</h1>
      <OrdersAdmin
        initialOrders={orders.map((o) => ({
          id: o.id,
          itemName: o.itemName,
          itemType: o.itemType,
          amount: o.amount,
          status: o.status,
          profile: o.profile ? { fullName: o.profile.fullName, email: o.profile.email } : null,
          studentPhone: o.studentPhone,
        }))}
      />
    </div>
  );
}
