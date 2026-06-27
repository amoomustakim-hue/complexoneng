import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/profile";
import { getOrCreateCoachSession } from "@/lib/coach";
import CoachChat from "@/components/coach/CoachChat";

export default async function CoachPage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/sign-in");
  }

  const session = await getOrCreateCoachSession(profile.id);
  const messages = (session.messages as { role: "user" | "model"; content: string }[]) ?? [];

  return (
    <div>
      <div className="px-6 pt-6">
        <p className="text-xs tracking-widest text-teal">AI ACADEMIC COACH</p>
        <h1 className="text-2xl font-bold text-teal mt-1">Your study coach</h1>
      </div>
      <CoachChat initialMessages={messages} />
    </div>
  );
}
