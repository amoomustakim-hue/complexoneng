import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ModulePainSolution from "@/components/landing/ModulePainSolution";

export default function CareerFuturePage() {
  return (
    <>
      <Navbar />
      <ModulePainSolution
        eyebrow="CAREER & FUTURE"
        headline={
          <>
            Scholarships close while
            <br />
            <span className="text-lime italic">they&apos;re still buried in a group chat.</span>
          </>
        }
        subcopy="Most students find out about a scholarship deadline the day after it passed — if they find out at all."
        painHeading="What's broken today"
        painPoints={[
          "Scholarship and opportunity info is scattered across Twitter, WhatsApp groups, and word of mouth.",
          "Deadlines get missed because there's no central place tracking what's closing soon.",
          "Choosing a career path is often a guess, not based on any real self-assessment.",
          "University applications get tracked in someone's notebook or memory, not a system.",
          "Internships are hard to find and even harder to keep track of once you've applied.",
        ]}
        solutionHeading="How ComplexOne helps"
        solutionPoints={[
          {
            icon: "Compass",
            title: "Career discovery quiz",
            body: "A short quiz that maps your interests and strengths to real career paths, with an AI explanation of why.",
          },
          {
            icon: "Award",
            title: "Scholarship search with urgency badges",
            body: "All opportunities in one searchable list, with a clear flag when a deadline is closing soon.",
          },
          {
            icon: "GraduationCap",
            title: "Admission Kanban tracker",
            body: "Track every university application from Researching to Admitted on one board instead of scattered notes.",
          },
          {
            icon: "Briefcase",
            title: "Internships, tracker & CV builder",
            body: "Find internships with an AI-match badge, track applications, and generate a tailored CV and cover letter.",
          },
        ]}
      />
      <Footer />
    </>
  );
}
