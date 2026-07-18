"use client";

import { useState } from "react";
import { Search, Copy, Check, Upload, ClipboardList, ChevronDown, Globe, Newspaper, BookOpen, FileText } from "lucide-react";

const STYLES = ["APA 7th edition", "MLA 9th edition", "Harvard", "Vancouver", "Chicago"] as const;
type Style = (typeof STYLES)[number];

type SourceType = "website" | "journal" | "book" | "report";
const SOURCE_TYPES: { key: SourceType; label: string; Icon: React.ElementType }[] = [
  { key: "website",  label: "Website",        Icon: Globe },
  { key: "journal",  label: "Journal article", Icon: Newspaper },
  { key: "book",     label: "Book",            Icon: BookOpen },
  { key: "report",   label: "Report / Thesis", Icon: FileText },
];

const inputClass = "mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-teal";

export default function CitationFormatter() {
  const [style, setStyle] = useState<Style>("APA 7th edition");
  const [styleOpen, setStyleOpen] = useState(false);

  // Search mode
  const [query, setQuery]     = useState("");
  const [searching, setSearching] = useState(false);

  // Manual mode
  const [manual, setManual]   = useState(false);
  const [source, setSource]   = useState<SourceType>("website");
  const [author, setAuthor]   = useState("");
  const [title, setTitle]     = useState("");
  const [year, setYear]       = useState("");
  const [url, setUrl]         = useState("");
  const [siteName, setSiteName] = useState("");
  const [accessDate, setAccessDate] = useState("");
  const [journal, setJournal] = useState("");
  const [volume, setVolume]   = useState("");
  const [issue, setIssue]     = useState("");
  const [pages, setPages]     = useState("");
  const [doi, setDoi]         = useState("");
  const [publisher, setPublisher] = useState("");
  const [edition, setEdition] = useState("");
  const [institution, setInstitution] = useState("");
  const [reportType, setReportType]   = useState("");

  const [citation, setCitation] = useState<string | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const [copied, setCopied]     = useState(false);
  const [generating, setGenerating] = useState(false);

  // ── auto-search submit ──────────────────────────────────────────────
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError(null);
    setCitation(null);

    const res = await fetch("/api/research/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ style, query: query.trim() }),
    });
    setSearching(false);

    if (res.ok) {
      const data = await res.json();
      setCitation(data.citation);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  }

  // ── manual submit ───────────────────────────────────────────────────
  async function handleManual(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    setError(null);
    setCitation(null);

    const res = await fetch("/api/research/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        style, sourceType: source,
        author, title, year, url, siteName, accessDate,
        journal, volume, issue, pages, doi,
        publisher, edition, institution, reportType,
      }),
    });
    setGenerating(false);

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
    <div className="flex flex-col items-center w-full">

      {/* ── Hero search area ──────────────────────────── */}
      {!manual && (
        <div className="w-full max-w-2xl flex flex-col items-center gap-5">

          {/* Style dropdown */}
          <div className="relative self-start">
            <button
              type="button"
              onClick={() => setStyleOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 transition bg-white"
            >
              {style}
              <ChevronDown size={14} className={`transition-transform ${styleOpen ? "rotate-180" : ""}`} />
            </button>
            {styleOpen && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[220px] py-1 overflow-hidden">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setStyle(s); setStyleOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition ${style === s ? "font-semibold text-teal" : "text-gray-700"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="w-full">
            <div className="flex items-center gap-3 border-2 border-gray-200 rounded-2xl px-5 py-4 bg-white hover:border-gray-300 focus-within:border-teal transition shadow-sm">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cite webpages, books, articles, and more"
                className="flex-1 text-base text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
              />
              <button
                type="submit"
                disabled={searching || !query.trim()}
                className="bg-teal text-cream font-bold px-6 py-2 rounded-xl text-sm disabled:opacity-50 hover:opacity-90 transition shrink-0"
              >
                {searching ? "Citing…" : "Cite"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Search by title, URL, DOI, ISBN, or keywords
            </p>
          </form>

          {/* Secondary actions */}
          <div className="flex items-center gap-6 text-sm">
            <button
              type="button"
              className="flex items-center gap-2 text-teal font-semibold hover:opacity-80 transition"
            >
              <Upload size={15} />
              Upload PDF
            </button>
            <span className="text-gray-300">|</span>
            <button
              type="button"
              onClick={() => { setManual(true); setCitation(null); setError(null); }}
              className="flex items-center gap-2 text-teal font-semibold hover:opacity-80 transition"
            >
              <ClipboardList size={15} />
              Cite manually
            </button>
          </div>
        </div>
      )}

      {/* ── Manual form ──────────────────────────────── */}
      {manual && (
        <div className="w-full max-w-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {/* Style dropdown (inline for manual) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setStyleOpen((o) => !o)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-400 bg-white"
                >
                  {style}
                  <ChevronDown size={14} className={`transition-transform ${styleOpen ? "rotate-180" : ""}`} />
                </button>
                {styleOpen && (
                  <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 min-w-[220px] py-1">
                    {STYLES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setStyle(s); setStyleOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${style === s ? "font-semibold text-teal" : "text-gray-700"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setManual(false); setCitation(null); setError(null); }}
              className="text-sm text-teal font-semibold hover:opacity-70"
            >
              ← Back to search
            </button>
          </div>

          {/* Source type tabs */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {SOURCE_TYPES.map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSource(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  source === key
                    ? "bg-teal text-cream border-teal"
                    : "border-gray-200 text-gray-600 hover:border-teal hover:text-teal"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleManual} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Author(s) <span className="text-red-400">*</span></label>
                <input required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Okafor, A. B., & Nwosu, C." className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700">Title <span className="text-red-400">*</span></label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder={source === "journal" ? "Article title" : source === "book" ? "Book title" : "Page or document title"} className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Year <span className="text-red-400">*</span></label>
                <input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className={inputClass} />
              </div>

              {source === "website" && <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Website name</label>
                  <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. BBC News" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">URL <span className="text-red-400">*</span></label>
                  <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Date accessed</label>
                  <input type="date" value={accessDate} onChange={(e) => setAccessDate(e.target.value)} className={inputClass} />
                </div>
              </>}

              {source === "journal" && <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Journal <span className="text-red-400">*</span></label>
                  <input required value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="e.g. Nature Medicine" className={inputClass} />
                </div>
                <div><label className="text-sm font-medium text-gray-700">Volume</label><input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="12" className={inputClass} /></div>
                <div><label className="text-sm font-medium text-gray-700">Issue</label><input value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="3" className={inputClass} /></div>
                <div><label className="text-sm font-medium text-gray-700">Pages</label><input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="45–62" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="text-sm font-medium text-gray-700">DOI / URL</label><input value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="https://doi.org/..." className={inputClass} /></div>
              </>}

              {source === "book" && <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Publisher <span className="text-red-400">*</span></label>
                  <input required value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="e.g. Oxford University Press" className={inputClass} />
                </div>
                <div><label className="text-sm font-medium text-gray-700">Edition</label><input value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="3rd" className={inputClass} /></div>
              </>}

              {source === "report" && <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Institution <span className="text-red-400">*</span></label>
                  <input required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Lagos" className={inputClass} />
                </div>
                <div><label className="text-sm font-medium text-gray-700">Report type</label><input value={reportType} onChange={(e) => setReportType(e.target.value)} placeholder="e.g. PhD Thesis" className={inputClass} /></div>
                <div className="sm:col-span-2"><label className="text-sm font-medium text-gray-700">URL</label><input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} /></div>
              </>}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button type="submit" disabled={generating} className="w-full bg-teal text-cream font-bold py-3 rounded-xl text-sm disabled:opacity-50 hover:opacity-90 transition">
              {generating ? "Generating…" : "Generate citation"}
            </button>
          </form>
        </div>
      )}

      {/* ── Citation output ───────────────────────────── */}
      {error && !manual && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}

      {citation && (
        <div className="w-full max-w-2xl mt-6 rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700">{style} citation</p>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1.5 text-sm font-semibold text-teal border border-teal/30 px-4 py-1.5 rounded-lg hover:bg-teal hover:text-cream transition"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy citation"}
            </button>
          </div>
          <div className="px-5 py-4">
            <p className="text-sm text-gray-800 leading-relaxed">{citation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
