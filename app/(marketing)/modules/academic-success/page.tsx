import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ModulePainSolution from "@/components/landing/ModulePainSolution";

export default function AcademicSuccessPage() {
  return (
    <>
      <Navbar />
      <ModulePainSolution
        eyebrow="ACADEMIC SUCCESS"
        headline={
          <>
            Studying for JAMB, WAEC, or NECO
            <br />
            <span className="text-lime italic">shouldn&apos;t feel like guesswork.</span>
          </>
        }
        subcopy="Most students prep with whatever past questions they can find, no feedback on what's actually weak, and no one to ask at 11pm before an exam."
        painHeading="What's broken today"
        painPoints={[
          "Past questions are scattered across PDFs and WhatsApp groups with no structure or explanations.",
          "Students don't know which topics they're actually weak in until the real exam.",
          "A personal tutor is expensive — most students never get one.",
          "The CBT exam format itself is unfamiliar and adds stress on top of the content.",
        ]}
        solutionHeading="How ComplexOne helps"
        solutionPoints={[
          {
            icon: "Brain",
            title: "A personal AI coach",
            body: "Available any time to explain a concept, answer a question on a lesson, or talk through exam anxiety.",
          },
          {
            icon: "BookOpen",
            title: "Realistic CBT mock exams",
            body: "JAMB, WAEC, NECO, and Post-UTME practice that mirrors the real exam format, not just a list of questions.",
          },
          {
            icon: "LineChart",
            title: "Weak-topic tracking",
            body: "Performance tracking shows exactly which subjects and topics need more work, instead of studying blind.",
          },
        ]}
      />
      <Footer />
    </>
  );
}
