"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

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

function urgencyBadge(deadline: string | null) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return null;
  if (days < 7)
    return (
      <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
        Closing soon
      </span>
    );
  if (days < 30)
    return (
      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
        Ends soon
      </span>
    );
  return null;
}

export default function OpportunityList({ opportunities }: { opportunities: Opportunity[] }) {
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = filter === "ALL" ? opportunities : opportunities.filter((o) => o.type === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.provider.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [opportunities, filter, query]);

  return (
    <div>
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search opportunities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border-light focus:outline-none focus:border-teal text-teal placeholder:text-muted bg-white"
        />
      </div>

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
          <p className="text-sm text-muted text-center py-12">No opportunities match your search.</p>
        )}
        {filtered.map((o) => (
          <a
            key={o.id}
            href={o.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border-light bg-white p-5 hover:border-teal transition"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-cream text-teal font-medium px-3 py-1 rounded-full">
                  {TYPE_LABELS[o.type] ?? o.type}
                </span>
                {urgencyBadge(o.deadline)}
              </div>
              {o.deadline && (
                <span className="text-xs text-muted">
                  Deadline:{" "}
                  {new Date(o.deadline).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
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
