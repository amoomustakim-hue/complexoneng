import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ModulePainSolution from "@/components/landing/ModulePainSolution";

export default function ResearchSupportPage() {
  return (
    <>
      <Navbar />
      <ModulePainSolution
        eyebrow="RESEARCH SUPPORT"
        headline={
          <>
            A blank page shouldn&apos;t be
            <br />
            <span className="text-lime italic">the hardest part of research.</span>
          </>
        }
        subcopy="Postgraduate students are often expected to know how to structure a proposal or format a citation with little guidance."
        painHeading="What's broken today"
        painPoints={[
          "Starting a research proposal from a blank page with no structure to follow.",
          "Citation formatting (APA, MLA, Harvard, Vancouver) is fiddly and easy to get wrong.",
          "Finding a research assistant, analyst, or supervisor is informal and unreliable.",
          "Methodology questions often go unanswered until the next supervisor meeting, days later.",
        ]}
        solutionHeading="How ComplexOne helps"
        solutionPoints={[
          {
            icon: "FileText",
            title: "AI proposal builder",
            body: "Answer a few prompts about your topic and get a structured first draft to work from, not a blank page.",
          },
          {
            icon: "Quote",
            title: "Citation formatter",
            body: "Enter your source details once and get an instantly formatted reference in the style you need.",
          },
          {
            icon: "Users",
            title: "Research marketplace",
            body: "Post a request for help or offer your own skills — connecting students with analysts and supervisors.",
          },
        ]}
      />
      <Footer />
    </>
  );
}
