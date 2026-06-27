"use client";

import { useState } from "react";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  condition: string | null;
};

const CATEGORIES = ["TEXTBOOK", "LAPTOP", "ACADEMIC_MATERIAL"];

export default function InventoryAdmin({ initialItems }: { initialItems: Item[] }) {
  const [items, setItems] = useState(initialItems);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        price: Number(price),
        stock: Number(stock) || 0,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setItems((prev) => [data.item, ...prev]);
      setName("");
      setPrice("");
      setStock("");
    }
  }

  async function deleteItem(id: string) {
    await fetch(`/api/admin/inventory/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <form onSubmit={addItem} className="flex flex-wrap gap-2 mb-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item name"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-28"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-24"
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          Add
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-border-light bg-white p-3"
          >
            <div>
              <p className="text-sm font-semibold text-teal">{item.name}</p>
              <p className="text-xs text-muted">
                {item.category} · ₦{item.price.toLocaleString()} · {item.stock} in stock
              </p>
            </div>
            <button
              onClick={() => deleteItem(item.id)}
              className="text-xs text-red-600 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-muted">No items yet.</p>}
      </div>
    </div>
  );
}
