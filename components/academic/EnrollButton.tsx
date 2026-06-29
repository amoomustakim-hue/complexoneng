"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnrollButton({
  courseId,
  initialEnrolled,
}: {
  courseId: string;
  initialEnrolled: boolean;
}) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (enrolled) {
      router.push(`/academic/courses/${courseId}`);
      return;
    }

    setLoading(true);
    setError("");
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setEnrolled(true);
      router.push(`/academic/courses/${courseId}`);
    } else {
      const data = await res.json();
      setError(data.error ?? "Couldn't enroll. Please try again.");
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className={`text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 ${
          enrolled ? "border border-border-light text-teal" : "bg-teal text-cream"
        }`}
      >
        {loading ? "Enrolling..." : enrolled ? "Continue" : "Enroll"}
      </button>
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
