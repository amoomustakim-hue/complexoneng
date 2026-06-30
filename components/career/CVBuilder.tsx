"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";

type Result = { summary: string; coverLetter: string };

export default function CVBuilder() {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [skills, setSkills] = useState("");
  const [role, setRole] = useState("");
  const [achievements, setAchievements] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<"summary" | "cover" | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const res = await fetch("/api/career/cv-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course, year, skills, role, achievements }),
    });
    setLoading(false);

    if (res.ok) {
      setResult(await res.json());
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Generation failed. Please try again.");
    }
  }

  function copy(type: "summary" | "cover") {
    const text = type === "summary" ? result?.summary : result?.coverLetter;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={generate} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-teal">Course of study <span className="text-red-500">*</span></label>
            <input required value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. Computer Science" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
          <div>
            <label className="text-sm font-medium text-teal">Year / Level <span className="text-red-500">*</span></label>
            <input required value={year} onChange={(e) => setYear(e.target.value)} placeholder="e.g. 300 Level / Final Year" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-teal">Target internship role <span className="text-red-500">*</span></label>
            <input required value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Software Engineering Intern at a fintech" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-teal">Skills <span className="text-red-500">*</span></label>
            <input required value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. Python, data analysis, teamwork, Microsoft Excel" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-teal">Notable achievements (optional)</label>
            <input value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="e.g. Dean's list, built a mobile app, led student union committee" className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-teal text-cream font-semibold px-6 py-3 rounded-xl disabled:opacity-50">
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate CV summary & cover letter"}
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border-light bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-teal tracking-wide">PROFESSIONAL SUMMARY</p>
              <button onClick={() => copy("summary")} className="flex items-center gap-1.5 text-xs text-teal border border-border-light px-3 py-1.5 rounded-lg hover:border-teal transition">
                {copied === "summary" ? <Check size={13} /> : <Copy size={13} />}
                {copied === "summary" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-teal leading-relaxed">{result.summary}</p>
          </div>

          <div className="rounded-xl border border-border-light bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-teal tracking-wide">COVER LETTER OPENING</p>
              <button onClick={() => copy("cover")} className="flex items-center gap-1.5 text-xs text-teal border border-border-light px-3 py-1.5 rounded-lg hover:border-teal transition">
                {copied === "cover" ? <Check size={13} /> : <Copy size={13} />}
                {copied === "cover" ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-sm text-teal leading-relaxed">{result.coverLetter}</p>
          </div>

          <button onClick={() => setResult(null)} className="text-sm text-muted underline">
            Edit and regenerate
          </button>
        </div>
      )}
    </div>
  );
}
