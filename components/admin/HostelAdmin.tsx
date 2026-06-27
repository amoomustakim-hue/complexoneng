"use client";

import { useState } from "react";

type Hostel = {
  id: string;
  name: string;
  type: string;
  area: string;
  pricePerYear: number;
  deposit: number;
  roomsAvailable: number;
};

export default function HostelAdmin({ initialHostels }: { initialHostels: Hostel[] }) {
  const [hostels, setHostels] = useState(initialHostels);
  const [name, setName] = useState("");
  const [type, setType] = useState("PARTNER");
  const [area, setArea] = useState("");
  const [pricePerYear, setPricePerYear] = useState("");
  const [deposit, setDeposit] = useState("");
  const [roomsAvailable, setRoomsAvailable] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addHostel(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await fetch("/api/admin/hostels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        type,
        area,
        pricePerYear: Number(pricePerYear),
        deposit: Number(deposit) || 0,
        roomsAvailable: Number(roomsAvailable) || 0,
      }),
    });

    setSubmitting(false);
    if (res.ok) {
      const data = await res.json();
      setHostels((prev) => [data.hostel, ...prev]);
      setName("");
      setArea("");
      setPricePerYear("");
      setDeposit("");
      setRoomsAvailable("");
    }
  }

  async function deleteHostel(id: string) {
    await fetch(`/api/admin/hostels/${id}`, { method: "DELETE" });
    setHostels((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div>
      <form onSubmit={addHostel} className="flex flex-wrap gap-2 mb-6">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Hostel name"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          <option value="OWNED">OWNED</option>
          <option value="PARTNER">PARTNER</option>
        </select>
        <input
          required
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-40"
        />
        <input
          required
          type="number"
          value={pricePerYear}
          onChange={(e) => setPricePerYear(e.target.value)}
          placeholder="Price/yr"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-28"
        />
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          placeholder="Deposit"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-28"
        />
        <input
          type="number"
          value={roomsAvailable}
          onChange={(e) => setRoomsAvailable(e.target.value)}
          placeholder="Rooms"
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
        {hostels.map((hostel) => (
          <div
            key={hostel.id}
            className="flex items-center justify-between rounded-lg border border-border-light bg-white p-3"
          >
            <div>
              <p className="text-sm font-semibold text-teal">{hostel.name}</p>
              <p className="text-xs text-muted">
                {hostel.type} · {hostel.area} · ₦{hostel.pricePerYear.toLocaleString()}/yr ·{" "}
                {hostel.roomsAvailable} rooms
              </p>
            </div>
            <button
              onClick={() => deleteHostel(hostel.id)}
              className="text-xs text-red-600 font-semibold"
            >
              Delete
            </button>
          </div>
        ))}
        {hostels.length === 0 && <p className="text-sm text-muted">No hostels yet.</p>}
      </div>
    </div>
  );
}
