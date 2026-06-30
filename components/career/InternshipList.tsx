"use client";

import { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";

type Internship = {
  id: string;
  title: string;
  provider: string;
  description: string;
  eligibility: string | null;
  deadline: string | null;
  link: string;
  category: string | null;
};

const INDUSTRIES = ["All", "Technology", "Finance", "Health", "Engineering", "Media", "Government"] as const;

function urgencyBadge(deadline: string | null) {
  if (!deadline) return null;
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return null;
  if (days < 7)
    return <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Closing soon</span>;
  if (days < 30)
    return <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Ends soon</span>;
  return null;
}

export default function InternshipList({
  internships,
  matchedCategory,
}: {
  internships: Internship[];
  matchedCategory: string | null;
}) {
  const [industry, setIndustry] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = internships;
    if (industry !== "All") {
      list = list.filter((i) =>
        i.title.toLowerCase().includes(industry.toLowerCase()) ||
        i.description.toLowerCase().includes(industry.toLowerCase()) ||
        i.provider.toLowerCase().includes(industry.toLowerCase())
      );
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.provider.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [internships, industry, query]);

  return (
    <div>
      {matchedCategory && (
        <div className="flex items-center gap-2 mb-5 rounded-xl border border-teal/20 bg-cream/50 px-4 py-3">
          <Sparkles size={15} className="text-teal shrink-0" />
          <p className="text-sm text-teal">
            Based on your career quiz, opportunities related to <span className="font-semibold">{matchedCategory}</span> are highlighted below.
          </p>
        </div>
      )}

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
        <input
          type="text"
          placeholder="Search internships..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border-light focus:outline-none focus:border-teal text-teal placeholder:text-muted bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind}
            onClick={() => setIndustry(ind)}
            className={`text-sm font-medium px-4 py-2 rounded-full whitespace-nowrap transition ${
              industry === ind ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-12">No internships match your search.</p>
        )}
        {filtered.map((i) => {
          const isMatch =
            matchedCategory &&
            (i.category === matchedCategory ||
              i.title.toLowerCase().includes(matchedCategory.toLowerCase()) ||
              i.description.toLowerCase().includes(matchedCategory.toLowerCase()));
          return (
            <a
              key={i.id}
              href={i.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-xl border p-5 hover:border-teal transition bg-white ${
                isMatch ? "border-teal/40" : "border-border-light"
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {isMatch && (
                    <span className="flex items-center gap-1 text-xs font-semibold bg-teal/10 text-teal px-2 py-0.5 rounded-full">
                      <Sparkles size={11} /> AI match
                    </span>
                  )}
                  {urgencyBadge(i.deadline)}
                </div>
                {i.deadline && (
                  <span className="text-xs text-muted">
                    Deadline:{" "}
                    {new Date(i.deadline).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                )}
              </div>
              <p className="font-bold text-teal mt-2">{i.title}</p>
              <p className="text-xs text-muted">{i.provider}</p>
              <p className="text-sm text-muted mt-2">{i.description}</p>
              {i.eligibility && <p className="text-xs text-muted mt-2">Eligibility: {i.eligibility}</p>}
            </a>
          );
        })}
      </div>
    </div>
  );
}
