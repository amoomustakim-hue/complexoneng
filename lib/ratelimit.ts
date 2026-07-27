import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "./redis";

let _aiLimiter: Ratelimit | null = null;

// 15 AI requests per user per minute across all three AI endpoints combined.
// Returns null when Redis isn't configured (rate limiting is skipped gracefully).
export function getAiRatelimit(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!_aiLimiter) {
    _aiLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, "1 m"),
      prefix: "rl:ai",
      analytics: true,
    });
  }
  return _aiLimiter;
}
