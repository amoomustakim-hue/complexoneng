"use client";

import { useState } from "react";

type Opportunity = {
  id: string;
  title: string;
  provider: string;
  type: string;
  description: string;
  eligibility: string | null;
  deadline: string | null;
  link: string;
};

const TYPE_LABELS: Record<string, string> = {
  ALL: "All",
  SCHOLARSHIP: "Scholarships",
  FELLOWSHIP: "Fellowships",
  COMPETITION: "Competitions",
  INTERNSHIP: "Internships",
};

export default function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? opportunities : opportunities.filter((o) => o.type === filter);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {Object.entries(TYPE_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition ${
              filter === key
                ? "bg-teal text-cream"
                : "bg-white border border-border-light text-teal"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-12">No opportunities in this category yet.</p>
        )}
        {filtered.map((o) => (
          <a
            key={o.id}
            href={o.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs bg-cream text-teal font-medium px-3 py-1 rounded-full">
                {TYPE_LABELS[o.type] ?? o.type}
              </span>
              {o.deadline && (
                <span className="text-xs text-muted">
                  Deadline: {new Date(o.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="font-bold text-teal mt-2">{o.title}</p>
            <p className="text-xs text-muted">{o.provider}</p>
            <p className="text-sm text-muted mt-2">{o.description}</p>
            {o.eligibility && (
              <p className="text-xs text-muted mt-2">Eligibility: {o.eligibility}</p>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
