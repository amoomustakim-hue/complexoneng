import { BookOpen, Briefcase, FlaskConical, ShoppingBag, Users, type LucideIcon } from "lucide-react";

export type Track = "HIGH_SCHOOL" | "UNDERGRAD" | "RESEARCHER" | null | undefined;

export type NavModuleKey = "academic" | "career" | "research" | "economy" | "community";

export const NAV_MODULES: Record<NavModuleKey, { href: string; label: string; icon: LucideIcon }> = {
  academic: { href: "/academic/dashboard", label: "Academic", icon: BookOpen },
  career: { href: "/career", label: "Career", icon: Briefcase },
  research: { href: "/research", label: "Research", icon: FlaskConical },
  economy: { href: "/economy", label: "Economy", icon: ShoppingBag },
  community: { href: "/community", label: "Community", icon: Users },
};

const ORDER_BY_TRACK: Record<string, NavModuleKey[]> = {
  HIGH_SCHOOL: ["academic", "career", "economy", "community", "research"],
  UNDERGRAD: ["academic", "career", "research", "economy", "community"],
  RESEARCHER: ["research", "community", "career", "economy", "academic"],
};

export function getNavOrder(track?: Track): NavModuleKey[] {
  return ORDER_BY_TRACK[track ?? ""] ?? ORDER_BY_TRACK.UNDERGRAD;
}
