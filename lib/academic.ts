const LEVEL_TO_COURSE_TAG: Record<string, string> = {
  SS1: "SS1",
  SS2: "SS2",
  SS3: "SS3",
  JAMB: "SS3",
  L100: "100L",
  L200: "200L",
  L300: "300L",
  L400: "400L",
};

export function getCourseTagForLevel(level?: string | null): string | null {
  if (!level) return null;
  return LEVEL_TO_COURSE_TAG[level] ?? null;
}
