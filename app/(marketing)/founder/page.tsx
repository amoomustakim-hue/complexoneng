import { MessageCircle } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const WHATSAPP_LINK =
  "https://wa.me/2348085611207?text=" +
  encodeURIComponent("Hi! I found ComplexOne and would love to connect.");

export default function FounderPage() {
  return (
    <>
      <Navbar />
      <section className="relative bg-teal-deep min-h-[70vh] flex items-center overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-light/40 blur-3xl animate-blob [animation-delay:-4s]" />
        </div>

        <div className="relative max-w-xl mx-auto px-6 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-teal-light shadow-neu text-3xl font-bold text-cream">
            FN
          </span>
          <p className="text-xs tracking-widest text-cream/60 mt-5">FOUNDER & CEO</p>
          <h1 className="font-[family-name:var(--font-instrument)] text-4xl text-cream font-light mt-2">
            [Founder&apos;s name]
          </h1>
          <p className="text-base text-cream/70 mt-5 leading-relaxed">
            Placeholder bio — replace this with the founder&apos;s real story: background, why
            ComplexOne was started, and what drives the mission. Keep it short, personal, and in
            first person if possible.
          </p>

          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-lime text-teal-deep font-semibold px-7 py-3.5 rounded-full mt-8 shadow-skeu active:shadow-skeu-pressed transition-shadow"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
        </div>
      </section>

      <Footer />
    </>
  );
}
