"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Camera, User } from "lucide-react";
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

type Step = "profile" | "track" | "details";

export default function OnboardingForm() {
  const router = useRouter();
  const { user } = useUser();

  // Step tracking
  const [step, setStep] = useState<Step>("profile");

  // Profile basics (step 0)
  const [fullName, setFullName] = useState(
    user ? [user.firstName, user.lastName].filter(Boolean).join(" ") : ""
  );
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.imageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track + details (step 1+2)
  const [track, setTrack] = useState<Track | null>(null);
  const [level, setLevel] = useState("");
  const [school, setSchool] = useState("");
  const [targetExam, setTargetExam] = useState("");
  const [courseOfStudy, setCourseOfStudy] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [researchStage, setResearchStage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // ── Step 0: avatar picker ─────────────────────────────────────────
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  function handleProfileContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return;
    setStep("track");
  }

  // ── Step 1: track selection ───────────────────────────────────────
  function selectTrack(t: Track) {
    setTrack(t);
    setLevel(t === "RESEARCHER" ? "POSTGRAD" : "");
    setTargetExam("");
    setStep("details");
  }

  // ── Step 2: final submit ──────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Upload avatar to Clerk if the user picked a new file
      let avatarUrl: string | undefined;
      if (avatarFile && user) {
        await user.setProfileImage({ file: avatarFile });
        await user.reload();
        avatarUrl = user.imageUrl;
      }

      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          dateOfBirth: dateOfBirth || null,
          avatarUrl: avatarUrl ?? null,
          track,
          level,
          school,
          targetExam,
          courseOfStudy,
          researchArea,
          researchStage,
        }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      router.push("/home");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Render step 0: profile basics ────────────────────────────────
  if (step === "profile") {
    return (
      <form onSubmit={handleProfileContinue} className="mt-6 flex flex-col gap-5">
        {/* Avatar picker */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative group"
          >
            <div className="w-24 h-24 rounded-full bg-border-light overflow-hidden flex items-center justify-center border-2 border-dashed border-teal/30 hover:border-teal transition-colors">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-muted" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-teal rounded-full p-1.5 shadow">
              <Camera size={13} className="text-cream" />
            </div>
          </button>
          <p className="text-xs text-muted">Upload your passport photo (optional)</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Full name */}
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="fullName">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Amina Okafor"
            className={inputClass}
          />
        </div>

        {/* Date of birth */}
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="dob">
            Date of birth
          </label>
          <input
            id="dob"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="bg-teal text-cream font-semibold px-6 py-3 rounded-lg mt-2"
        >
          Continue →
        </button>
      </form>
    );
  }

  // ── Render step 1: track picker ───────────────────────────────────
  if (step === "track") {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setStep("profile")}
          className="text-xs text-muted hover:text-teal text-left mb-4"
        >
          ← Back
        </button>
        <TrackPicker onSelect={selectTrack} />
      </div>
    );
  }

  // ── Render step 2: track details ──────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setStep("track")}
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
            onChange={(e) => {
              setLevel(e.target.value);
              if (e.target.value === "JAMB") setTargetExam("JAMB");
              else setTargetExam("");
            }}
            className={inputClass}
          >
            <option value="" disabled>
              Select your level
            </option>
            {track && LEVELS_BY_TRACK[track].map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* JAMB candidates: course combination instead of school */}
      {track === "HIGH_SCHOOL" && level === "JAMB" ? (
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="courseOfStudy">
            Course combination
          </label>
          <input
            id="courseOfStudy"
            type="text"
            value={courseOfStudy}
            onChange={(e) => setCourseOfStudy(e.target.value)}
            placeholder="e.g. Physics, Chemistry, Biology, Mathematics"
            className={inputClass}
          />
          <p className="text-xs text-muted mt-1">The 4 subjects you&apos;re sitting for in JAMB</p>
        </div>
      ) : (
        <div>
          <label className="text-sm font-medium text-teal" htmlFor="school">
            School (optional)
          </label>
          <input
            id="school"
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            placeholder={track === "HIGH_SCHOOL" ? "e.g. Kings College Lagos" : "e.g. UNILAG"}
            className={inputClass}
          />
        </div>
      )}

      {track === "HIGH_SCHOOL" && level !== "JAMB" && (
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
        {submitting ? "Setting up your account…" : "Get started"}
      </button>
    </form>
  );
}
