"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

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
  status: string;
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

type MyOffer = {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  request: { id: string; title: string; status: string };
};

const REQUEST_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

const OFFER_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ACCEPTED: "bg-green-50 text-green-700 border-green-200",
  DECLINED: "bg-red-50 text-red-600 border-red-200",
};

export default function ResearchMarketplace({
  initialOpen,
  initialMine,
  initialMyOffers,
}: {
  initialOpen: OpenRequest[];
  initialMine: MyRequest[];
  initialMyOffers: MyOffer[];
}) {
  const [tab, setTab] = useState<"browse" | "mine" | "my-offers" | "post">("browse");
  const open = initialOpen;
  const [mine, setMine] = useState(initialMine);
  const [myOffers, setMyOffers] = useState(initialMyOffers);
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
      const data = await res.json();
      setSentOffers((prev) => new Set(prev).add(requestId));
      setMyOffers((prev) => [
        {
          id: data.offer.id,
          message: data.offer.message,
          status: "PENDING",
          createdAt: data.offer.createdAt,
          request: open.find((r) => r.id === requestId)
            ? { id: requestId, title: open.find((r) => r.id === requestId)!.title, status: "OPEN" }
            : { id: requestId, title: "Request", status: "OPEN" },
        },
        ...prev,
      ]);
    }
  }

  async function setOfferStatus(requestId: string, offerId: string, status: "ACCEPTED" | "DECLINED") {
    const res = await fetch(`/api/research/requests/${requestId}/offers/${offerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setMine((prev) =>
        prev.map((r) => {
          if (r.id !== requestId) return r;
          return {
            ...r,
            status: status === "ACCEPTED" ? "IN_PROGRESS" : r.status,
            offers: r.offers.map((o) => (o.id === offerId ? { ...o, status } : o)),
          };
        })
      );
    }
  }

  async function withdrawOffer(requestId: string, offerId: string) {
    const res = await fetch(`/api/research/requests/${requestId}/offers/${offerId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setMyOffers((prev) => prev.filter((o) => o.id !== offerId));
      setSentOffers((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  }

  async function updateRequestStatus(requestId: string, status: string) {
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

  const tabs = [
    { key: "browse", label: "Browse" },
    { key: "mine", label: "My requests" },
    { key: "my-offers", label: "My offers" },
    { key: "post", label: "Post a request" },
  ] as const;

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition ${
              tab === t.key
                ? "bg-teal text-cream"
                : "bg-white border border-border-light text-teal"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Browse open requests */}
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
                <span>{r._count.offers} offer{r._count.offers === 1 ? "" : "s"}</span>
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

      {/* My posted requests + incoming offers */}
      {tab === "mine" && (
        <div className="flex flex-col gap-4 mt-6">
          {mine.length === 0 && (
            <p className="text-sm text-muted text-center py-12">
              You haven&apos;t posted any requests yet.
            </p>
          )}
          {mine.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="font-bold text-teal">{r.title}</p>
                <select
                  value={r.status}
                  onChange={(e) => updateRequestStatus(r.id, e.target.value)}
                  className="text-xs border border-border-light rounded-lg px-2 py-1.5 text-teal"
                >
                  {Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-sm text-muted mt-1">{r.description}</p>

              {r.offers.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  <p className="text-xs font-semibold text-teal">
                    Offers ({r.offers.length})
                  </p>
                  {r.offers.map((o) => (
                    <div
                      key={o.id}
                      className={`rounded-lg border p-3 ${
                        o.status === "ACCEPTED"
                          ? "border-green-200 bg-green-50"
                          : o.status === "DECLINED"
                            ? "border-red-100 bg-red-50/40 opacity-60"
                            : "border-border-light bg-cream"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-xs font-semibold text-teal">
                          {o.profile.fullName ?? o.profile.email}
                        </p>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${OFFER_STATUS_STYLES[o.status]}`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted mt-1">{o.message}</p>
                      {o.status === "PENDING" && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setOfferStatus(r.id, o.id, "ACCEPTED")}
                            className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100 hover:bg-green-200 px-3 py-1.5 rounded-lg transition"
                          >
                            <CheckCircle size={13} /> Accept
                          </button>
                          <button
                            onClick={() => setOfferStatus(r.id, o.id, "DECLINED")}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                          >
                            <XCircle size={13} /> Decline
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My sent offers — helper's view */}
      {tab === "my-offers" && (
        <div className="flex flex-col gap-3 mt-6">
          {myOffers.length === 0 && (
            <p className="text-sm text-muted text-center py-12">
              You haven&apos;t sent any offers yet. Browse open requests to get started.
            </p>
          )}
          {myOffers.map((o) => (
            <div key={o.id} className="rounded-xl border border-border-light bg-white p-5">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="font-bold text-teal">{o.request.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    Request is {REQUEST_STATUS_LABELS[o.request.status] ?? o.request.status}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${OFFER_STATUS_STYLES[o.status]}`}
                >
                  {o.status === "PENDING" ? "Awaiting response" : o.status}
                </span>
              </div>
              <p className="text-sm text-muted mt-2 italic">&ldquo;{o.message}&rdquo;</p>
              {o.status === "PENDING" && (
                <button
                  onClick={() => withdrawOffer(o.request.id, o.id)}
                  className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 mt-3 transition"
                >
                  <Trash2 size={12} /> Withdraw offer
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Post a new request */}
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
