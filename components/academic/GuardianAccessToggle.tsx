"use client";

import { useState } from "react";

export default function GuardianAccessToggle({
  initialEnabled,
  initialSlug,
  baseUrl,
}: {
  initialEnabled: boolean;
  initialSlug: string | null;
  baseUrl: string;
}) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [slug, setSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/guardian/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !enabled }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setEnabled(data.guardianAccess);
      setSlug(data.guardianSlug);
    }
  }

  function copyLink() {
    if (!slug) return;
    navigator.clipboard.writeText(`${baseUrl}/g/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border-light bg-white p-5 flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="font-bold text-teal">Share progress with a parent or teacher</p>
        <p className="text-sm text-muted mt-1">
          {enabled
            ? "Anyone with the link can view a read-only summary of your progress."
            : "Off by default. Turn this on to get a link you can share."}
        </p>
        {enabled && slug && (
          <p className="text-xs text-teal font-mono mt-2 break-all">
            {baseUrl}/g/{slug}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {enabled && slug && (
          <button
            onClick={copyLink}
            className="text-sm font-semibold text-teal border border-border-light px-4 py-2 rounded-lg"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        )}
        <button
          onClick={toggle}
          disabled={loading}
          className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {enabled ? "Turn off" : "Turn on"}
        </button>
      </div>
    </div>
  );
}
