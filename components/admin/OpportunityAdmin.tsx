"use client";

import { useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  provider: string;
  type: string;
  category: string | null;
  description: string;
  eligibility: string | null;
  deadline: string | null;
  link: string;
  level: string | null;
};

const TYPES = ["SCHOLARSHIP", "FELLOWSHIP", "COMPETITION", "INTERNSHIP"];
const CATEGORIES = [
  "MEDICINE",
  "ENGINEERING",
  "DATA_SCIENCE",
  "LAW",
  "BUSINESS",
  "ARTS_HUMANITIES",
  "EDUCATION",
  "TECHNOLOGY",
];
const LEVELS = ["SS1", "SS2", "SS3", "JAMB", "L100", "L200", "L300", "L400", "POSTGRAD"];

export default function OpportunityAdmin({
  initialOpportunities,
}: {
  initialOpportunities: Opportunity[];
}) {
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [title, setTitle] = useState("");
  const [provider, setProvider] = useState("");
  const [type, setType] = useState("SCHOLARSHIP");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [deadline, setDeadline] = useState("");
  const [link, setLink] = useState("");
  const [level, setLevel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function addOpportunity(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/admin/opportunities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        provider,
        type,
        category: category || undefined,
        description,
        eligibility,
        deadline: deadline || undefined,
        link,
        level: level || undefined,
      }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const data = await res.json();
    setOpportunities((prev) => [
      { ...data.opportunity, deadline: data.opportunity.deadline ? data.opportunity.deadline.slice(0, 10) : null },
      ...prev,
    ]);
    setTitle("");
    setProvider("");
    setDescription("");
    setEligibility("");
    setDeadline("");
    setLink("");
    setCategory("");
    setLevel("");
  }

  async function deleteOpportunity(id: string) {
    await fetch(`/api/admin/opportunities/${id}`, { method: "DELETE" });
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
  }

  return (
    <div>
      <form
        onSubmit={addOpportunity}
        className="flex flex-col gap-2 mb-6 border border-border-light rounded-xl p-4"
      >
        <p className="text-sm font-semibold text-teal">Add an opportunity</p>
        <div className="flex flex-wrap gap-2">
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
          />
          <input
            required
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Provider"
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[160px]"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={2}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        <input
          value={eligibility}
          onChange={(e) => setEligibility(e.target.value)}
          placeholder="Eligibility (optional)"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
          >
            <option value="">No category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
          >
            <option value="">Any level</option>
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
          />
        </div>
        <input
          required
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Apply link (https://...)"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50 w-fit"
        >
          {submitting ? "Adding..." : "Add opportunity"}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {opportunities.map((o) => (
          <div key={o.id} className="rounded-lg border border-border-light bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {o.type} · {o.provider} {o.deadline ? `· due ${o.deadline}` : ""}
                </p>
                <p className="text-sm font-semibold text-teal mt-1">{o.title}</p>
                <p className="text-xs text-muted mt-1">{o.description}</p>
              </div>
              <button
                onClick={() => deleteOpportunity(o.id)}
                className="text-xs text-red-600 font-semibold shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {opportunities.length === 0 && <p className="text-sm text-muted">No opportunities yet.</p>}
      </div>
    </div>
  );
}
