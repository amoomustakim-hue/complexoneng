import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { getOrCreateCoachSession } from "@/lib/coach";
import CoachChat from "@/components/coach/CoachChat";

export default async function ResearchAssistantPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const session = await getOrCreateCoachSession(profile.id, "research");
  const messages = (session.messages as { role: "user" | "model"; content: string }[]) ?? [];

  return (
    <div>
      <div className="px-6 pt-6">
        <p className="text-xs tracking-widest text-teal">RESEARCH SUPPORT CENTRE</p>
        <h1 className="text-2xl font-bold text-teal mt-1">Research assistant</h1>
      </div>
      <CoachChat
        initialMessages={messages}
        endpoint="/api/ai/research"
        placeholder="Ask about your proposal, methodology, or analysis..."
        emptyHint="Ask about proposal structure, methodology, data analysis, or referencing."
      />
    </div>
  );
}
