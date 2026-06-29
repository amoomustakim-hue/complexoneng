"use client";

import { useState } from "react";
import CoachChat from "@/components/coach/CoachChat";
import LessonNotes from "@/components/academic/LessonNotes";
import LessonQA from "@/components/academic/LessonQA";

type ChatMessage = { role: "user" | "model"; content: string };
type Answer = {
  id: string;
  content: string;
  isBest: boolean;
  profile: { fullName: string | null; email: string };
};
type Question = {
  id: string;
  content: string;
  profile: { fullName: string | null; email: string };
  profileId: string;
  answers: Answer[];
};

export default function LessonSidePanel({
  lessonId,
  currentProfileId,
  initialAiMessages,
  initialNoteContent,
  initialQuestions,
}: {
  lessonId: string;
  currentProfileId: string;
  initialAiMessages: ChatMessage[];
  initialNoteContent: string;
  initialQuestions: Question[];
}) {
  const [tab, setTab] = useState<"ai" | "notes" | "qa">("ai");

  return (
    <div className="rounded-xl border border-border-light bg-white mt-8 overflow-hidden">
      <div className="flex border-b border-border-light">
        {[
          { key: "ai", label: "Ask AI" },
          { key: "notes", label: "My notes" },
          { key: "qa", label: "Q&A" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`flex-1 text-sm font-medium px-4 py-3 ${
              tab === t.key ? "text-teal border-b-2 border-teal" : "text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className={tab === "ai" ? "" : "hidden"}>
        <CoachChat
          initialMessages={initialAiMessages}
          endpoint={`/api/ai/lesson/${lessonId}`}
          placeholder="Ask about this lesson..."
          emptyHint="Ask anything about this specific lesson — concepts, examples, or anything confusing."
          heightClassName="h-[28rem]"
        />
      </div>

      {tab === "notes" && (
        <div className="p-4">
          <LessonNotes lessonId={lessonId} initialContent={initialNoteContent} />
        </div>
      )}

      {tab === "qa" && (
        <div className="p-4">
          <LessonQA
            lessonId={lessonId}
            initialQuestions={initialQuestions}
            currentProfileId={currentProfileId}
          />
        </div>
      )}
    </div>
  );
}
