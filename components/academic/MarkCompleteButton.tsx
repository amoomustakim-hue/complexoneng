"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MarkCompleteButton({
  lessonId,
  initialCompleted,
}: {
  lessonId: string;
  initialCompleted: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const res = await fetch(`/api/lessons/${lessonId}/complete`, {
      method: completed ? "DELETE" : "POST",
    });
    setLoading(false);

    if (res.ok) {
      setCompleted(!completed);
      router.refresh();
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50 ${
        completed ? "border border-teal text-teal" : "bg-teal text-cream"
      }`}
    >
      {completed ? "Completed ✓" : "Mark as complete"}
    </button>
  );
}
