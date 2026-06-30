"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

const FIELDS = [
  { key: "title", label: "Research Title", placeholder: "e.g. Impact of fintech adoption on SME growth in Lagos", required: true, multiline: false },
  { key: "background", label: "Background / Problem Statement", placeholder: "What is the problem? What gap in knowledge does this study address?", required: true, multiline: true },
  { key: "questions", label: "Research Questions", placeholder: "List the key questions your research will answer.", required: true, multiline: true },
  { key: "objectives", label: "Objectives", placeholder: "List your specific research objectives.", required: false, multiline: true },
  { key: "methodology", label: "Methodology", placeholder: "e.g. Quantitative survey of 200 SMEs in Lagos using SPSS regression analysis.", required: false, multiline: true },
  { key: "significance", label: "Significance of Study", placeholder: "Why does this research matter? Who benefits?", required: false, multiline: true },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export default function ProposalBuilder() {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    title: "",
    background: "",
    questions: "",
    objectives: "",
    methodology: "",
    significance: "",
  });
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function set(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDraft(null);

    const res = await fetch("/api/research/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      setDraft(data.draft);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    }
  }

  function copy() {
    if (!draft) return;
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {!draft ? (
        <form onSubmit={generate} className="space-y-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-medium text-teal">
                {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {f.multiline ? (
                <textarea
                  required={f.required}
                  rows={3}
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal"
                />
              ) : (
                <input
                  required={f.required}
                  type="text"
                  value={values[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full border border-border-light rounded-xl px-3 py-2 text-sm text-teal focus:outline-none focus:border-teal"
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal text-cream font-semibold px-6 py-3 rounded-xl disabled:opacity-50 w-full"
          >
            {loading ? "Generating proposal draft..." : "Generate proposal draft"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-teal">Your proposal draft</p>
            <button
              onClick={copy}
              className="flex items-center gap-1.5 text-xs text-teal border border-border-light px-3 py-1.5 rounded-lg hover:border-teal transition"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="rounded-xl border border-border-light bg-cream/30 p-5">
            <p className="text-sm text-teal leading-relaxed whitespace-pre-wrap">{draft}</p>
          </div>

          <button
            onClick={() => setDraft(null)}
            className="text-sm text-muted underline"
          >
            Edit inputs and regenerate
          </button>
        </div>
      )}
    </div>
  );
}
