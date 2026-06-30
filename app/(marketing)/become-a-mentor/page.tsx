import { Sparkles } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import MentorApplicationForm from "@/components/landing/MentorApplicationForm";

export default function BecomeAMentorPage() {
  return (
    <>
      <Navbar />
      <section className="relative bg-teal-deep min-h-[60vh] flex items-center overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-light/40 blur-3xl animate-blob [animation-delay:-4s]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-glass">
            <Sparkles size={14} className="text-lime" />
            <span className="text-xs tracking-widest text-cream/80">MENTORSHIP NETWORK</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl text-cream font-light leading-[1.1] mt-6">
            Share what you know.
            <br />
            <span className="text-lime italic">Shape a student&apos;s journey.</span>
          </h1>
          <p className="text-base text-cream/70 mt-5 max-w-lg mx-auto">
            Tell us a bit about yourself below. We review every application personally — once
            we confirm you, you&apos;ll be added to the platform as a mentor for students to
            reach.
          </p>
        </div>
      </section>

      <section className="relative bg-cream py-20">
        <div className="relative px-6">
          <MentorApplicationForm />
        </div>
      </section>

      <Footer />
    </>
  );
}
