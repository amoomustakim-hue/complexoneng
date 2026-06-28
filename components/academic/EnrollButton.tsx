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

  async function handleClick() {
    if (enrolled) {
      router.push(`/academic/courses/${courseId}`);
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    setLoading(false);

    if (res.ok) {
      setEnrolled(true);
      router.push(`/academic/courses/${courseId}`);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 ${
        enrolled ? "border border-border-light text-teal" : "bg-teal text-cream"
      }`}
    >
      {loading ? "Enrolling..." : enrolled ? "Continue" : "Enroll"}
    </button>
  );
}
