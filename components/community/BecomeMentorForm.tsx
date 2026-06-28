"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BecomeMentorForm({
  initialBio,
  initialExpertise,
}: {
  initialBio: string;
  initialExpertise: string;
}) {
  const router = useRouter();
  const [bio, setBio] = useState(initialBio);
  const [expertise, setExpertise] = useState(initialExpertise);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/community/mentors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorBio: bio, mentorExpertise: expertise }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    router.push("/community/mentorship");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mt-6">
      <div>
        <label className="text-sm font-medium text-teal">Areas of expertise</label>
        <input
          required
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          placeholder="e.g. Career coaching, Computer Science, Postgraduate applications"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">Short bio</label>
        <textarea
          required
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell students a bit about your background and how you can help..."
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Become a mentor"}
      </button>
    </form>
  );
}
