"use client";

import { useState } from "react";
import { Copy, Check, Globe, BookOpen, FileText, Newspaper } from "lucide-react";

const STYLES = ["APA", "MLA", "Harvard", "Vancouver"] as const;
type Style = (typeof STYLES)[number];

type SourceType = "website" | "journal" | "book" | "report";

const SOURCE_TYPES: { key: SourceType; label: string; Icon: React.ElementType }[] = [
  { key: "website", label: "Website", Icon: Globe },
  { key: "journal", label: "Journal Article", Icon: Newspaper },
  { key: "book", label: "Book", Icon: BookOpen },
  { key: "report", label: "Report / Thesis", Icon: FileText },
];

const inputClass =
  "mt-1 w-full border border-border-light rounded-xl px-3 py-2.5 text-sm text-teal focus:outline-none focus:border-teal";

export default function CitationFormatter() {
  const [style, setStyle] = useState<Style>("APA");
  const [source, setSource] = useState<SourceType>("website");

  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [url, setUrl] = useState("");
  const [siteName, setSiteName] = useState("");
  const [accessDate, setAccessDate] = useState("");
  const [journal, setJournal] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  const [publisher, setPublisher] = useState("");
  const [edition, setEdition] = useState("");
  const [institution, setInstitution] = useState("");
  const [reportType, setReportType] = useState("");

  const [loading, setLoading] = useState(false);
  const [citation, setCitation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function resetFields() {
    setCitation(null);
    setError(null);
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCitation(null);

    const res = await fetch("/api/research/citations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        style,
        sourceType: source,
        author, title, year, url, siteName, accessDate,
        journal, volume, issue, pages, doi,
        publisher, edition, institution, reportType,
      }),
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
    <div className="space-y-6">
      {/* Style pills */}
      <div>
        <p className="text-xs font-semibold text-muted tracking-widest mb-2">CITATION STYLE</p>
        <div className="flex gap-2 flex-wrap">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStyle(s); resetFields(); }}
              className={`text-sm font-semibold px-5 py-2 rounded-full border transition ${
                style === s
                  ? "bg-teal text-cream border-teal"
                  : "border-border-light text-teal hover:border-teal"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Source type tabs */}
      <div>
        <p className="text-xs font-semibold text-muted tracking-widest mb-2">SOURCE TYPE</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOURCE_TYPES.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setSource(key); resetFields(); }}
              className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-sm font-medium transition ${
                source === key
                  ? "border-teal bg-cream text-teal"
                  : "border-border-light text-muted hover:border-teal hover:text-teal"
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Fields by source type */}
      <form onSubmit={generate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-teal">
              Author(s) <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Okafor, A. B., & Nwosu, C."
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-teal">
              {source === "journal" ? "Article title" : "Title"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                source === "website" ? "Page or article title" :
                source === "journal" ? "Title of the article" :
                source === "book" ? "Book title" : "Report or thesis title"
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-teal">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              className={inputClass}
            />
          </div>

          {/* Website-specific */}
          {source === "website" && (
            <>
              <div>
                <label className="text-sm font-medium text-teal">Website name</label>
                <input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="e.g. BBC News" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-teal">URL <span className="text-red-500">*</span></label>
                <input required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Date accessed</label>
                <input type="date" value={accessDate} onChange={(e) => setAccessDate(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {/* Journal-specific */}
          {source === "journal" && (
            <>
              <div>
                <label className="text-sm font-medium text-teal">Journal name <span className="text-red-500">*</span></label>
                <input required value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="e.g. Nature Medicine" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Volume</label>
                <input value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="12" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Issue</label>
                <input value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="3" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Pages</label>
                <input value={pages} onChange={(e) => setPages(e.target.value)} placeholder="45–62" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-teal">DOI / URL</label>
                <input value={doi} onChange={(e) => setDoi(e.target.value)} placeholder="https://doi.org/..." className={inputClass} />
              </div>
            </>
          )}

          {/* Book-specific */}
          {source === "book" && (
            <>
              <div>
                <label className="text-sm font-medium text-teal">Publisher <span className="text-red-500">*</span></label>
                <input required value={publisher} onChange={(e) => setPublisher(e.target.value)} placeholder="e.g. Oxford University Press" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Edition</label>
                <input value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="3rd" className={inputClass} />
              </div>
            </>
          )}

          {/* Report/Thesis-specific */}
          {source === "report" && (
            <>
              <div>
                <label className="text-sm font-medium text-teal">Institution / University <span className="text-red-500">*</span></label>
                <input required value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="e.g. University of Lagos" className={inputClass} />
              </div>
              <div>
                <label className="text-sm font-medium text-teal">Report type</label>
                <input value={reportType} onChange={(e) => setReportType(e.target.value)} placeholder="e.g. PhD Thesis, Technical Report" className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-teal">URL (if available)</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            </>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal text-cream font-semibold py-3 rounded-xl disabled:opacity-50 text-sm"
        >
          {loading ? "Generating citation…" : "Generate citation"}
        </button>
      </form>

      {citation && (
        <div className="rounded-2xl border-2 border-teal/20 bg-cream/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal tracking-widest">{style}</span>
              <span className="text-xs text-muted">·</span>
              <span className="text-xs text-muted capitalize">{source}</span>
            </div>
            <button
              type="button"
              onClick={copy}
              className="flex items-center gap-1.5 text-xs font-semibold text-teal border border-teal/30 px-3 py-1.5 rounded-lg hover:bg-teal hover:text-cream transition"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-sm text-teal leading-relaxed font-mono bg-white rounded-lg px-4 py-3 border border-border-light">
            {citation}
          </p>
        </div>
      )}
    </div>
  );
}
