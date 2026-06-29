"use client";

import { useState } from "react";
import { Star } from "lucide-react";

export default function CourseReviewForm({
  courseId,
  initialRating,
  initialComment,
}: {
  courseId: string;
  initialRating: number;
  initialComment: string;
}) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    if (!rating) return;
    setSubmitting(true);
    const res = await fetch(`/api/courses/${courseId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    setSubmitting(false);
    if (res.ok) setSaved(true);
  }

  return (
    <div className="rounded-xl border border-border-light bg-white p-4">
      <p className="text-sm font-bold text-teal">
        {initialRating ? "Your review" : "Rate this course"}
      </p>
      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star
              size={20}
              className={n <= rating ? "text-lime fill-lime" : "text-border-light"}
            />
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional: tell other students what you thought..."
        rows={2}
        className="w-full text-sm border border-border-light rounded-lg px-3 py-2 text-teal mt-2"
      />
      <button
        onClick={submit}
        disabled={submitting || !rating}
        className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg mt-2 disabled:opacity-50"
      >
        {submitting ? "Saving..." : saved ? "Saved ✓" : "Submit review"}
      </button>
    </div>
  );
}
