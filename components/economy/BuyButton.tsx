"use client";

import { useState } from "react";

export default function BuyButton({
  itemType,
  itemId,
  label = "Buy now",
  className,
}: {
  itemType: "INVENTORY" | "HOSTEL";
  itemId: string;
  label?: string;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/payments/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemType, itemId }),
    });

    const data = await res.json();

    if (res.ok && data.authorizationUrl) {
      window.location.href = data.authorizationUrl;
      return;
    }

    setLoading(false);
    setError(data.error ?? "Something went wrong. Please try again.");
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={
          className ??
          "text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg disabled:opacity-50"
        }
      >
        {loading ? "Starting checkout..." : label}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
