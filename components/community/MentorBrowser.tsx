"use client";

import { useState } from "react";

type Mentor = {
  id: string;
  fullName: string | null;
  email: string;
  mentorBio: string | null;
  mentorExpertise: string | null;
};

export default function MentorBrowser({ mentors }: { mentors: Mentor[] }) {
  const [drafts, setDrafts] = useState<Record<string, { message: string; topic: string }>>({});
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  function updateDraft(mentorId: string, field: "message" | "topic", value: string) {
    setDrafts((prev) => {
      const current = prev[mentorId] ?? { message: "", topic: "" };
      return { ...prev, [mentorId]: { ...current, [field]: value } };
    });
  }

  async function requestSession(mentorId: string) {
    const draft = drafts[mentorId];
    if (!draft?.message?.trim()) return;

    const res = await fetch(`/api/community/mentors/${mentorId}/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: draft.message, preferredTopic: draft.topic }),
    });

    if (res.ok) {
      setSent((prev) => new Set(prev).add(mentorId));
    } else {
      const data = await res.json();
      setErrors((prev) => ({ ...prev, [mentorId]: data.error ?? "Couldn't send request." }));
    }
  }

  if (mentors.length === 0) {
    return (
      <p className="text-sm text-muted text-center py-12">No mentors available yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {mentors.map((m) => (
        <div key={m.id} className="rounded-xl border border-border-light bg-white p-5">
          <p className="font-bold text-teal">{m.fullName ?? m.email}</p>
          {m.mentorExpertise && (
            <p className="text-xs text-teal font-medium mt-1">{m.mentorExpertise}</p>
          )}
          {m.mentorBio && <p className="text-sm text-muted mt-1">{m.mentorBio}</p>}

          {sent.has(m.id) ? (
            <p className="text-xs text-teal font-semibold mt-3">Request sent ✓</p>
          ) : (
            <div className="flex flex-col gap-2 mt-3">
              <input
                value={drafts[m.id]?.topic ?? ""}
                onChange={(e) => updateDraft(m.id, "topic", e.target.value)}
                placeholder="Preferred topic (optional)"
                className="text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
              />
              <textarea
                value={drafts[m.id]?.message ?? ""}
                onChange={(e) => updateDraft(m.id, "message", e.target.value)}
                placeholder="Introduce yourself and what you'd like guidance on..."
                rows={2}
                className="text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
              />
              {errors[m.id] && <p className="text-xs text-red-600">{errors[m.id]}</p>}
              <button
                onClick={() => requestSession(m.id)}
                className="self-start text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg"
              >
                Request session
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
