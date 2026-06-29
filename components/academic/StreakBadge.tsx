import { Flame, Trophy } from "lucide-react";

export default function StreakBadge({
  currentStreak,
  points,
}: {
  currentStreak: number;
  points: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5">
        <Flame size={16} className={currentStreak > 0 ? "text-orange-500" : "text-muted"} />
        <span className="text-sm font-bold text-teal">{currentStreak}</span>
        <span className="text-xs text-muted">day streak</span>
      </div>
      <div className="flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5">
        <Trophy size={16} className="text-lime" />
        <span className="text-sm font-bold text-teal">{points}</span>
        <span className="text-xs text-muted">points</span>
      </div>
    </div>
  );
}
