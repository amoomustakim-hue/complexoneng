"use client";

import { useState } from "react";

export default function VisibilityToggle({
  initialPublic,
  initialSlug,
  baseUrl,
}: {
  initialPublic: boolean;
  initialSlug: string | null;
  baseUrl: string;
}) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [slug, setSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch("/api/portfolio/visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !isPublic }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setIsPublic(data.portfolioPublic);
      setSlug(data.portfolioSlug);
    }
  }

  function copyLink() {
    if (!slug) return;
    navigator.clipboard.writeText(`${baseUrl}/p/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-border-light bg-white p-5 flex items-center justify-between flex-wrap gap-3">
      <div>
        <p className="font-bold text-teal">Public portfolio link</p>
        <p className="text-sm text-muted mt-1">
          {isPublic
            ? "Anyone with the link can view your portfolio."
            : "Your portfolio is private. Turn this on to get a shareable link."}
        </p>
        {isPublic && slug && (
          <p className="text-xs text-teal font-mono mt-2 break-all">
            {baseUrl}/p/{slug}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        {isPublic && slug && (
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
          {isPublic ? "Make private" : "Make public"}
        </button>
      </div>
    </div>
  );
}
