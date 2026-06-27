"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LEVELS = [
  { value: "SS1", label: "SS1" },
  { value: "SS2", label: "SS2" },
  { value: "SS3", label: "SS3" },
  { value: "JAMB", label: "JAMB candidate" },
  { value: "L100", label: "100 level" },
  { value: "L200", label: "200 level" },
  { value: "L300", label: "300 level" },
  { value: "L400", label: "400 level" },
  { value: "POSTGRAD", label: "Postgraduate" },
];

const EXAMS = [
  { value: "JAMB", label: "JAMB" },
  { value: "WAEC", label: "WAEC" },
  { value: "NECO", label: "NECO" },
  { value: "POST_UTME", label: "Post-UTME" },
];

export default function OnboardingForm() {
  const router = useRouter();
  const [level, setLevel] = useState("");
  const [school, setSchool] = useState("");
  const [targetExam, setTargetExam] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level, school, targetExam }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.push("/academic/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-teal" htmlFor="level">
          Academic level
        </label>
        <select
          id="level"
          required
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          <option value="" disabled>
            Select your level
          </option>
          {LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-teal" htmlFor="school">
          School (optional)
        </label>
        <input
          id="school"
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          placeholder="e.g. UNILAG"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-teal" htmlFor="targetExam">
          Target exam
        </label>
        <select
          id="targetExam"
          required
          value={targetExam}
          onChange={(e) => setTargetExam(e.target.value)}
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        >
          <option value="" disabled>
            Select your target exam
          </option>
          {EXAMS.map((ex) => (
            <option key={ex.value} value={ex.value}>
              {ex.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-2 disabled:opacity-50"
      >
        {submitting ? "Saving..." : "Continue"}
      </button>
    </form>
  );
}
