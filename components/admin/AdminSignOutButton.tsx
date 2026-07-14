"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function AdminSignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignOut() {
    setLoading(true);
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-teal transition-colors disabled:opacity-50"
    >
      <LogOut size={14} />
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
