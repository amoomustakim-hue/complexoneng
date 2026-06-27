"use client";

import { useState } from "react";

type Order = {
  id: string;
  itemName: string;
  itemType: string;
  amount: number;
  status: string;
  profile: { fullName: string | null; email: string } | null;
  studentPhone: string | null;
};

const STATUSES = ["PENDING", "PAID", "FULFILLED", "CANCELLED"];

export default function OrdersAdmin({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");

  async function updateStatus(id: string, status: string) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const visible = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full ${
              filter === s ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-lg border border-border-light bg-white p-3"
          >
            <div>
              <p className="text-sm font-semibold text-teal">{order.itemName}</p>
              <p className="text-xs text-muted">
                {order.itemType} · ₦{order.amount.toLocaleString()} ·{" "}
                {order.profile?.fullName ?? order.profile?.email ?? order.studentPhone ?? "Unknown"}
              </p>
            </div>
            <select
              value={order.status}
              onChange={(e) => updateStatus(order.id, e.target.value)}
              className="text-xs border border-border-light rounded-lg px-2 py-1.5 text-teal"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        ))}
        {visible.length === 0 && <p className="text-sm text-muted">No orders found.</p>}
      </div>
    </div>
  );
}
