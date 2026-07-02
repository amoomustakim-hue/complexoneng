import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ModulePainSolution from "@/components/landing/ModulePainSolution";

export default function MentorNetworkPage() {
  return (
    <>
      <Navbar />
      <ModulePainSolution
        eyebrow="MENTOR NETWORK"
        headline={
          <>
            Finding a mentor shouldn&apos;t depend on
            <br />
            <span className="text-lime italic">who you already know.</span>
          </>
        }
        subcopy="Most students get mentored by luck — a helpful lecturer, a sibling's contact. ComplexOne makes that guidance available to everyone, not just the well-connected."
        painHeading="What's broken today"
        painPoints={[
          "Mentorship is informal — students rely on word of mouth, cold DMs, or hoping a lecturer notices them.",
          "There's no way to know if someone is actually experienced in your specific area before reaching out.",
          "Most advice is a one-off conversation with no follow-up, no structure, and no accountability.",
          "Students don't know what kind of mentor they need until they've already wasted time with the wrong one.",
        ]}
        solutionHeading="How ComplexOne helps"
        solutionPoints={[
          {
            icon: "Users",
            title: "Verified mentor profiles",
            body: "Every mentor has a reviewed bio and declared expertise — find the right fit by area, not just whoever responds first.",
          },
          {
            icon: "MessageSquare",
            title: "Structured mentorship requests",
            body: "Send a request with your specific goal or question. Your mentor sees it, accepts or declines, and you start from a shared understanding.",
          },
          {
            icon: "Award",
            title: "Become a mentor",
            body: "Have expertise to share? Apply to join the network, help students in your field, and build your professional reputation.",
          },
        ]}
      />
      <Footer />
    </>
  );
}
