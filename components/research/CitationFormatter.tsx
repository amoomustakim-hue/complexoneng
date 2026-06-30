"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const STYLES = ["APA", "MLA", "Harvard", "Vancouver"] as const;
type Style = (typeof STYLES)[number];

export default function CitationFormatter() {
  const [style, setStyle] = useState<Style>("APA");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [publisher, setPublisher] = useState("");
  const [journal, setJournal] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCitation(null);

    const res = await fetch("/api/research/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style, author, title, year, publisher, journal, volume, issue, pages, url }),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setCitation(data.citation);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  }

  function copy() {
    if (!citation) return;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <form onSubmit={generate} className="space-y-5">
      <div>
        <label className="text-sm font-medium text-teal">Citation style</label>
        <div className="flex gap-2 mt-2">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStyle(s)}
              className={`text-sm font-medium px-4 py-2 rounded-full transition ${
                style === s ? "bg-teal text-cream" : "border border-border-light text-teal"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-teal">Author(s) <span className="text-red-500">*</span></label>
          <input required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Okafor, A. B., & Nwosu, C." className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-teal">Title <span className="text-red-500">*</span></label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of article, book, or chapter" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
        <div>
          <label className="text-sm font-medium text-teal">Year <span className="text-red-500">*</span></label>
          <input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
        <div>
          <label className="text-sm font-medium text-teal">Publisher (for books)</label>
          <input value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="e.g. Oxford University Press" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
        <div>
          <label className="text-sm font-medium text-teal">Journal name</label>
          <input value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="e.g. Journal of Finance" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
        <div>
          <label className="text-sm font-medium text-teal">Volume / Issue / Pages</label>
          <div className="flex gap-2 mt-1">
            <input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="Vol." className="w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            <input value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="Issue" className="w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
            <input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="pp." className="w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-teal">URL / DOI (optional)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://doi.org/..." className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={loading} className="bg-teal text-cream font-semibold px-6 py-3 rounded-xl disabled:opacity-50 w-full">
        {loading ? "Formatting citation..." : "Format citation"}
      </button>

      {citation && (
        <div className="rounded-xl border border-teal/30 bg-cream/50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-teal tracking-wide">{style} CITATION</p>
            <button type="button" onClick={copy} className="flex items-center gap-1.5 text-xs text-teal border border-border-light px-3 py-1.5 rounded-lg hover:border-teal transition">
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-sm text-teal leading-relaxed font-mono">{citation}</p>
        </div>
      )}
    </form>
  );
}
