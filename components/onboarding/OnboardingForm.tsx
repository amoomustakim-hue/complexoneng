"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TrackPicker, { type Track } from "@/components/onboarding/TrackPicker";

const LEVELS_BY_TRACK: Record<Track, { value: string; label: string }[]> = {
  HIGH_SCHOOL: [
    { value: "SS1", label: "SS1" },
    { value: "SS2", label: "SS2" },
    { value: "SS3", label: "SS3" },
    { value: "JAMB", label: "JAMB candidate" },
  ],
  UNDERGRAD: [
    { value: "L100", label: "100 level" },
    { value: "L200", label: "200 level" },
    { value: "L300", label: "300 level" },
    { value: "L400", label: "400 level" },
  ],
  RESEARCHER: [{ value: "POSTGRAD", label: "Postgraduate" }],
};

const EXAMS = [
  { value: "JAMB", label: "JAMB" },
  { value: "WAEC", label: "WAEC" },
  { value: "NECO", label: "NECO" },
  { value: "POST_UTME", label: "Post-UTME" },
];

const RESEARCH_STAGES = [
  { value: "proposal", label: "Working on my proposal" },
  { value: "data_collection", label: "Data collection" },
  { value: "data_analysis", label: "Data analysis" },
  { value: "writing_up", label: "Writing up" },
  { value: "other", label: "Other" },
];

const inputClass =
  "mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal";

export default function OnboardingForm() {
  const router = useRouter();
  const [track, setTrack] = useState<Track | null>(null);
  const [level, setLevel] = useState("");
  const [school, setSchool] = useState("");
  const [targetExam, setTargetExam] = useState("");
  const [courseOfStudy, setCourseOfStudy] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [researchStage, setResearchStage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function selectTrack(t: Track) {
    setTrack(t);
    setLevel(t === "RESEARCHER" ? "POSTGRAD" : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        track,
        level,
        school,
        targetExam,
        courseOfStudy,
        researchArea,
        researchStage,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.push("/home");
  }

  if (!track) {
    return <TrackPicker onSelect={selectTrack} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setTrack(null)}
        className="text-xs text-muted hover:text-teal text-left -mb-1"
      >
        ← Change track
      </button>

      {track !== "RESEARCHER" && (
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="level">
            {track === "HIGH_SCHOOL" ? "Academic level" : "Level"}
          </label>
          <select
            id="level"
            required
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Select your level
            </option>
            {LEVELS_BY_TRACK[track].map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      )}

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
          className={inputClass}
        />
      </div>

      {track === "HIGH_SCHOOL" && (
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="targetExam">
            Target exam
          </label>
          <select
            id="targetExam"
            required
            value={targetExam}
            onChange={(e) => setTargetExam(e.target.value)}
            className={inputClass}
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
      )}

      {track === "UNDERGRAD" && (
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="courseOfStudy">
            Course of study (optional)
          </label>
          <input
            id="courseOfStudy"
            type="text"
            value={courseOfStudy}
            onChange={(e) => setCourseOfStudy(e.target.value)}
            placeholder="e.g. Computer Science"
            className={inputClass}
          />
        </div>
      )}

      {track === "RESEARCHER" && (
        <>
          <div>
            <label className="text-sm font-medium text-teal" htmlFor="researchArea">
              Research area
            </label>
            <input
              id="researchArea"
              type="text"
              required
              value={researchArea}
              onChange={(e) => setResearchArea(e.target.value)}
              placeholder="e.g. Public Health"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-teal" htmlFor="researchStage">
              Where are you in your research? (optional)
            </label>
            <select
              id="researchStage"
              value={researchStage}
              onChange={(e) => setResearchStage(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a stage</option>
              {RESEARCH_STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

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
