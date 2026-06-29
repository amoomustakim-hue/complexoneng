export type MasteryBucket = "not_started" | "beginner" | "developing" | "proficient" | "mastered";

export function getMasteryBucket(pct: number): MasteryBucket {
  if (pct <= 0) return "not_started";
  if (pct < 40) return "beginner";
  if (pct < 70) return "developing";
  if (pct < 90) return "proficient";
  return "mastered";
}

export const MASTERY_LABELS: Record<MasteryBucket, string> = {
  not_started: "Not started",
  beginner: "Beginner",
  developing: "Developing",
  proficient: "Proficient",
  mastered: "Mastered",
};

export const MASTERY_STYLES: Record<MasteryBucket, string> = {
  not_started: "bg-white border-border-light text-muted",
  beginner: "bg-white border-border-light text-teal",
  developing: "bg-cream border-lime-dim text-teal",
  proficient: "bg-teal/10 border-teal text-teal",
  mastered: "bg-teal border-teal text-cream",
};

export function computeModuleMastery(
  lessonRatio: number,
  quizRatio: number | null
): number {
  if (quizRatio === null) {
    return Math.round(lessonRatio * 70);
  }
  return Math.round((lessonRatio * 0.4 + quizRatio * 0.6) * 100);
}
