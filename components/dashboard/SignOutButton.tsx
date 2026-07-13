"use client";

import { useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOut({ redirectUrl: "/sign-in" });
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
