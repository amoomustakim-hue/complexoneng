"use client";

import { useEffect, useRef, useState } from "react";

export default function LessonNotes({
  lessonId,
  initialContent,
}: {
  lessonId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleChange(value: string) {
    setContent(value);
    setStatus("saving");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      await fetch(`/api/lessons/${lessonId}/notes`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: value }),
      });
      setStatus("saved");
    }, 800);
  }

  return (
    <div>
      <textarea
        value={content}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Jot down anything you want to remember about this lesson..."
        rows={8}
        className="w-full text-sm border border-border-light rounded-lg px-3 py-2 text-teal"
      />
      <p className="text-xs text-muted mt-1">
        {status === "saving" ? "Saving..." : status === "saved" ? "Saved ✓" : ""}
      </p>
    </div>
  );
}
