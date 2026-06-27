"use client";

import { useState } from "react";

type OpenRequest = {
  id: string;
  title: string;
  description: string;
  skillsNeeded: string | null;
  budget: string | null;
  _count: { offers: number };
};

type Offer = {
  id: string;
  message: string;
  createdAt: string;
  profile: { fullName: string | null; email: string };
};

type MyRequest = {
  id: string;
  title: string;
  description: string;
  status: string;
  offers: Offer[];
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export default function ResearchMarketplace({
  initialOpen,
  initialMine,
}: {
  initialOpen: OpenRequest[];
  initialMine: MyRequest[];
}) {
  const [tab, setTab] = useState<"browse" | "mine" | "post">("browse");
  const open = initialOpen;
  const [mine, setMine] = useState(initialMine);
  const [offerDrafts, setOfferDrafts] = useState<Record<string, string>>({});
  const [sentOffers, setSentOffers] = useState<Set<string>>(new Set());

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [budget, setBudget] = useState("");
  const [posting, setPosting] = useState(false);

  async function submitOffer(requestId: string) {
    const message = offerDrafts[requestId]?.trim();
    if (!message) return;

    const res = await fetch(`/api/research/requests/${requestId}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (res.ok) {
      setSentOffers((prev) => new Set(prev).add(requestId));
    }
  }

  async function updateStatus(requestId: string, status: string) {
    setMine((prev) => prev.map((r) => (r.id === requestId ? { ...r, status } : r)));
    await fetch(`/api/research/requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function postRequest(e: React.FormEvent) {
    e.preventDefault();
    setPosting(true);
    const res = await fetch("/api/research/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, skillsNeeded, budget }),
    });
    setPosting(false);

    if (res.ok) {
      const data = await res.json();
      setMine((prev) => [{ ...data.request, offers: [] }, ...prev]);
      setTitle("");
      setDescription("");
      setSkillsNeeded("");
      setBudget("");
      setTab("mine");
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        {[
          { key: "browse", label: "Browse" },
          { key: "mine", label: "My requests" },
          { key: "post", label: "Post a request" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition ${
              tab === t.key ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "browse" && (
        <div className="flex flex-col gap-3 mt-6">
          {open.length === 0 && (
            <p className="text-sm text-muted text-center py-12">
              No open requests right now. Check back later.
            </p>
          )}
          {open.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-light bg-white p-5">
              <p className="font-bold text-teal">{r.title}</p>
              <p className="text-sm text-muted mt-1">{r.description}</p>
              <div className="flex gap-4 text-xs text-muted mt-2">
                {r.skillsNeeded && <span>Skills: {r.skillsNeeded}</span>}
                {r.budget && <span>Budget: {r.budget}</span>}
                <span>{r._count.offers} offer(s)</span>
              </div>

              {sentOffers.has(r.id) ? (
                <p className="text-xs text-teal font-semibold mt-3">Offer sent ✓</p>
              ) : (
                <div className="flex gap-2 mt-3">
                  <input
                    value={offerDrafts[r.id] ?? ""}
                    onChange={(e) =>
                      setOfferDrafts((prev) => ({ ...prev, [r.id]: e.target.value }))
                    }
                    placeholder="Introduce yourself and how you can help..."
                    className="flex-1 text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
                  />
                  <button
                    onClick={() => submitOffer(r.id)}
                    className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
                  >
                    Offer help
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "mine" && (
        <div className="flex flex-col gap-4 mt-6">
          {mine.length === 0 && (
            <p className="text-sm text-muted text-center py-12">
              You haven&apos;t posted any requests yet.
            </p>
          )}
          {mine.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold text-teal">{r.title}</p>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className="text-xs border border-border-light rounded-lg px-2 py-1.5 text-teal"
                >
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-muted mt-1">{r.description}</p>

              {r.offers.length > 0 && (
                <div className="mt-3 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-teal">Offers ({r.offers.length})</p>
                  {r.offers.map((o) => (
                    <div key={o.id} className="rounded-lg bg-cream p-3">
                      <p className="text-xs font-semibold text-teal">
                        {o.profile.fullName ?? o.profile.email}
                      </p>
                      <p className="text-sm text-muted mt-1">{o.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "post" && (
        <form onSubmit={postRequest} className="flex flex-col gap-4 mt-6 max-w-lg">
          <div>
            <label className="text-sm font-medium text-teal">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Need help with SPSS regression analysis"
              className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-teal">Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe what you need help with..."
              className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-teal">Skills needed (optional)</label>
            <input
              value={skillsNeeded}
              onChange={(e) => setSkillsNeeded(e.target.value)}
              placeholder="e.g. SPSS, statistics"
              className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-teal">Budget (optional)</label>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. ₦15,000"
              className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
            />
          </div>
          <button
            type="submit"
            disabled={posting}
            className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {posting ? "Posting..." : "Post request"}
          </button>
        </form>
      )}
    </div>
  );
}
