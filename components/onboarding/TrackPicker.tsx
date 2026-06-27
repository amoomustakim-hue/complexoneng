"use client";

import { GraduationCap, Building2, FlaskConical, type LucideIcon } from "lucide-react";

export type Track = "HIGH_SCHOOL" | "UNDERGRAD" | "RESEARCHER";

const TRACKS: { value: Track; icon: LucideIcon; title: string; body: string }[] = [
  {
    value: "HIGH_SCHOOL",
    icon: GraduationCap,
    title: "High school / JAMB candidate",
    body: "SS1–SS3, JAMB, WAEC, NECO, or Post-UTME prep.",
  },
  {
    value: "UNDERGRAD",
    icon: Building2,
    title: "University student",
    body: "100–400 level coursework, career planning, and campus life.",
  },
  {
    value: "RESEARCHER",
    icon: FlaskConical,
    title: "Postgraduate / Researcher",
    body: "Postgraduate studies, research support, and mentorship.",
  },
];

export default function TrackPicker({ onSelect }: { onSelect: (track: Track) => void }) {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {TRACKS.map((t) => {
        const Icon = t.icon;
        return (
          <button
            key={t.value}
            type="button"
            onClick={() => onSelect(t.value)}
            className="flex items-start gap-4 text-left rounded-xl border border-border-light p-4 hover:border-teal transition"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream">
              <Icon className="text-teal" size={20} />
            </span>
            <span>
              <p className="font-bold text-teal">{t.title}</p>
              <p className="text-sm text-muted mt-0.5">{t.body}</p>
            </span>
          </button>
        );
      })}
    </div>
  );
}
