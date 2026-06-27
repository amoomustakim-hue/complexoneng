"use client";

import { useState } from "react";

type SentRequest = {
  id: string;
  message: string;
  preferredTopic: string | null;
  status: string;
  mentor: { fullName: string | null; email: string };
};

type ReceivedRequest = {
  id: string;
  message: string;
  preferredTopic: string | null;
  status: string;
  student: { fullName: string | null; email: string };
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  ACCEPTED: "Accepted",
  DECLINED: "Declined",
  COMPLETED: "Completed",
};

export default function MentorshipRequests({
  isMentor,
  initialSent,
  initialReceived,
}: {
  isMentor: boolean;
  initialSent: SentRequest[];
  initialReceived: ReceivedRequest[];
}) {
  const [tab, setTab] = useState<"sent" | "received">(isMentor ? "received" : "sent");
  const [received, setReceived] = useState(initialReceived);

  async function updateStatus(id: string, status: string) {
    setReceived((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/community/mentorship/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  return (
    <div>
      {isMentor && (
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("received")}
            className={`text-sm font-medium px-4 py-2 rounded-full ${
              tab === "received" ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            Received
          </button>
          <button
            onClick={() => setTab("sent")}
            className={`text-sm font-medium px-4 py-2 rounded-full ${
              tab === "sent" ? "bg-teal text-cream" : "bg-white border border-border-light text-teal"
            }`}
          >
            Sent
          </button>
        </div>
      )}

      {tab === "sent" && (
        <div className="flex flex-col gap-3">
          {initialSent.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-light bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-teal">{r.mentor.fullName ?? r.mentor.email}</p>
                <span className="text-xs font-semibold text-teal">{STATUS_LABELS[r.status]}</span>
              </div>
              {r.preferredTopic && <p className="text-xs text-muted mt-1">{r.preferredTopic}</p>}
              <p className="text-sm text-muted mt-1">{r.message}</p>
            </div>
          ))}
          {initialSent.length === 0 && (
            <p className="text-sm text-muted text-center py-12">No requests sent yet.</p>
          )}
        </div>
      )}

      {tab === "received" && (
        <div className="flex flex-col gap-3">
          {received.map((r) => (
            <div key={r.id} className="rounded-xl border border-border-light bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="font-bold text-teal">{r.student.fullName ?? r.student.email}</p>
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
              {r.preferredTopic && <p className="text-xs text-muted mt-1">{r.preferredTopic}</p>}
              <p className="text-sm text-muted mt-1">{r.message}</p>
            </div>
          ))}
          {received.length === 0 && (
            <p className="text-sm text-muted text-center py-12">No requests received yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
