"use client";

import { useState } from "react";

export type FieldConfig = {
  key: string;
  label: string;
  type: "text" | "textarea" | "date";
  required?: boolean;
};

export type PortfolioItem = Record<string, string | null> & { id: string };

export default function PortfolioListSection({
  title,
  apiPath,
  responseKey,
  fields,
  initialItems,
  renderSummary,
}: {
  title: string;
  apiPath: string;
  responseKey: string;
  fields: FieldConfig[];
  initialItems: PortfolioItem[];
  renderSummary: (item: PortfolioItem) => { heading: string; subheading?: string };
}) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error ?? "Couldn't save. Please try again.");
      return;
    }

    setItems((prev) => [data[responseKey], ...prev]);
    setDraft({});
    setShowForm(false);
  }

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch(`${apiPath}/${id}`, { method: "DELETE" });
  }

  return (
    <div className="rounded-xl border border-border-light bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-teal">{title}</h2>
        <button
          onClick={() => setShowForm((s) => !s)}
          className="text-xs font-semibold text-teal border border-border-light px-3 py-1.5 rounded-full"
        >
          {showForm ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="flex flex-col gap-2 mt-4">
          {fields.map((f) => (
            <div key={f.key}>
              {f.type === "textarea" ? (
                <textarea
                  required={f.required}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  rows={2}
                  className="w-full text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
                />
              ) : (
                <input
                  type={f.type === "date" ? "date" : "text"}
                  required={f.required}
                  value={draft[f.key] ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                  placeholder={f.label}
                  className="w-full text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
                />
              )}
            </div>
          ))}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="self-start text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2 mt-4">
        {items.map((item) => {
          const { heading, subheading } = renderSummary(item);
          return (
            <div
              key={item.id}
              className="flex items-start justify-between gap-2 rounded-lg bg-cream px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium text-teal">{heading}</p>
                {subheading && <p className="text-xs text-muted">{subheading}</p>}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs text-red-600 shrink-0"
              >
                Remove
              </button>
            </div>
          );
        })}
        {items.length === 0 && !showForm && (
          <p className="text-xs text-muted">Nothing added yet.</p>
        )}
      </div>
    </div>
  );
}
