import Link from "next/link";
import { Sparkles, Target, Users2 } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <section className="relative bg-teal-deep min-h-[50vh] flex items-center overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-light/40 blur-3xl animate-blob [animation-delay:-4s]" />
        </div>
        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-glass">
            <Sparkles size={14} className="text-lime" />
            <span className="text-xs tracking-widest text-cream/80">ABOUT COMPLEXONE</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl text-cream font-light leading-[1.1] mt-6">
            Built by people who lived
            <br />
            <span className="text-lime italic">the problem first-hand.</span>
          </h1>
          <p className="text-base text-cream/70 mt-5 max-w-lg mx-auto">
            ComplexOne is built and operated by CODEDDEVS TECHNOLOGY LTD, based in Lagos,
            Nigeria.
          </p>
        </div>
      </section>

      <section className="relative bg-cream py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-teal text-center">Our story</h2>
          <p className="text-sm text-muted leading-relaxed mt-5">
            ComplexOne started from a simple observation: Nigerian students were juggling exam
            prep, scholarship hunting, university applications, and research support across a
            dozen disconnected WhatsApp groups, PDFs, and word of mouth — with no single place
            built for the whole journey. We set out to build that place: one platform that
            follows a student from secondary school through postgraduate research.
          </p>
          <p className="text-xs text-muted/70 mt-4 italic">
            This page has placeholder copy — replace this section with ComplexOne&apos;s real
            founding story.
          </p>
        </div>
      </section>

      <section className="relative bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border-light bg-cream/60 p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal shadow-skeu">
              <Target className="text-lime" size={18} />
            </span>
            <h3 className="font-bold text-teal mt-4">Our mission</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              To give every Nigerian student access to the tools — AI coaching, career guidance,
              and research support — that used to be reserved for those who could afford a
              private tutor or consultant.
            </p>
          </div>
          <div className="rounded-2xl border border-border-light bg-cream/60 p-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal shadow-skeu">
              <Users2 className="text-lime" size={18} />
            </span>
            <h3 className="font-bold text-teal mt-4">Who we are</h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              A small team based in Lagos, Nigeria, building ComplexOne under CODEDDEVS
              TECHNOLOGY LTD.{" "}
              <Link href="/founder" className="text-teal font-semibold underline">
                Meet the founder →
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
