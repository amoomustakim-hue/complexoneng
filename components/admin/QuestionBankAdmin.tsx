"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  examType: string;
  subject: string;
  year: number | null;
  question: string;
  options: string[];
  answer: string;
  explanation: string | null;
};

const EXAM_TYPES = ["JAMB", "WAEC", "NECO", "POST_UTME"];

export default function QuestionBankAdmin({
  initialQuestions,
  initialExamType,
  initialSubject,
}: {
  initialQuestions: Question[];
  initialExamType: string;
  initialSubject: string;
}) {
  const router = useRouter();
  const [questions, setQuestions] = useState(initialQuestions);

  const [filterExamType, setFilterExamType] = useState(initialExamType);
  const [filterSubject, setFilterSubject] = useState(initialSubject);

  const [examType, setExamType] = useState("JAMB");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filterExamType) params.set("examType", filterExamType);
    if (filterSubject) params.set("subject", filterSubject);
    router.push(`/admin/questions?${params.toString()}`);
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examType,
        subject,
        year: Number(year) || undefined,
        question,
        options,
        answer,
        explanation,
      }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }

    const data = await res.json();
    setQuestions((prev) => [data.question, ...prev]);
    setSubject("");
    setYear("");
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setExplanation("");
  }

  async function deleteQuestion(id: string) {
    await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  return (
    <div>
      <form onSubmit={applyFilters} className="flex flex-wrap gap-2 mb-6">
        <select
          value={filterExamType}
          onChange={(e) => setFilterExamType(e.target.value)}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          <option value="">All exam types</option>
          {EXAM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          placeholder="Filter by subject"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        <button
          type="submit"
          className="text-sm font-semibold text-teal border border-border-light px-4 py-2 rounded-lg"
        >
          Filter
        </button>
      </form>

      <form onSubmit={addQuestion} className="flex flex-col gap-2 mb-6 border border-border-light rounded-xl p-4">
        <p className="text-sm font-semibold text-teal">Add a question</p>
        <div className="flex flex-wrap gap-2">
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
          >
            {EXAM_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal flex-1 min-w-[140px]"
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal w-24"
          />
        </div>
        <textarea
          required
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question text"
          rows={2}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, i) => (
            <input
              key={i}
              required
              value={opt}
              onChange={(e) =>
                setOptions((prev) => prev.map((o, oi) => (oi === i ? e.target.value : o)))
              }
              placeholder={`Option ${i + 1}`}
              className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
            />
          ))}
        </div>
        <input
          required
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Correct answer (must match one option exactly)"
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Explanation (optional)"
          rows={2}
          className="border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="bg-teal text-cream font-semibold px-4 py-2 rounded-lg text-sm disabled:opacity-50 w-fit"
        >
          {submitting ? "Adding..." : "Add question"}
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-border-light bg-white p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs text-muted">
                  {q.examType} · {q.subject} {q.year ? `· ${q.year}` : ""}
                </p>
                <p className="text-sm text-teal font-medium mt-1">{q.question}</p>
                <p className="text-xs text-muted mt-1">
                  Options: {q.options.join(" / ")} — Answer: <strong>{q.answer}</strong>
                </p>
              </div>
              <button
                onClick={() => deleteQuestion(q.id)}
                className="text-xs text-red-600 font-semibold shrink-0"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {questions.length === 0 && <p className="text-sm text-muted">No questions found.</p>}
      </div>
    </div>
  );
}
