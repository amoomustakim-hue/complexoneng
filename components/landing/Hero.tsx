"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Sparkles, TrendingUp, Users2, Check } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const checklist = [
  "AI coaching & CBT prep",
  "Career, scholarships & research support",
  "Hostels, community & portfolio",
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const blobY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const chipY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative bg-teal-deep min-h-screen flex items-center overflow-hidden pt-32 pb-16"
    >
      {/* Claymorphism blobs */}
      <motion.div style={{ y: blobY }} className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-3xl animate-blob" />
        <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-light/40 blur-3xl animate-blob [animation-delay:-4s]" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime/10 blur-3xl animate-blob [animation-delay:-8s]" />
      </motion.div>

      <div className="relative max-w-4xl mx-auto px-6 w-full flex flex-col items-center text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-glass"
        >
          <Sparkles size={14} className="text-lime" />
          <span className="text-xs tracking-widest text-cream/80">IDEA POINT · 2026</span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="font-[family-name:var(--font-instrument)] text-5xl md:text-7xl text-cream font-light leading-[1.05] mt-6"
        >
          One platform.
          <br />
          <span className="text-lime italic">Every student journey.</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-lg text-cream/70 mt-6 max-w-lg"
        >
          AI coaching, CBT prep, career discovery, hostel booking, and research support — built
          for Nigerian students.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8"
        >
          {checklist.map((item) => (
            <span key={item} className="flex items-center gap-2 text-sm text-cream/80">
              <Check size={14} className="text-lime" strokeWidth={3} />
              {item}
            </span>
          ))}
        </motion.div>

        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="flex flex-wrap justify-center gap-4 mt-9"
        >
          <Link
            href="/sign-up"
            className="bg-lime text-teal-deep font-semibold px-7 py-3.5 rounded-full shadow-skeu active:shadow-skeu-pressed transition-shadow"
          >
            Get started free
          </Link>
          <a
            href="#how-it-works"
            className="border border-white/15 bg-white/5 backdrop-blur-md text-cream px-7 py-3.5 rounded-full font-semibold hover:bg-white/10 transition shadow-glass"
          >
            See how it works
          </a>
        </motion.div>

        <motion.p
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-xs text-cream/40 mt-6"
        >
          Free to start · No credit card required
        </motion.p>

        <motion.div style={{ y: cardY }} className="relative w-full max-w-xl h-72 md:h-80 mt-16">
          {/* Glass device card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 rounded-[2rem] border border-white/15 bg-white/[0.07] backdrop-blur-2xl shadow-glass-lg p-6 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-lime" />
              <span className="h-2.5 w-2.5 rounded-full bg-cream/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-cream/40" />
            </div>
            <div className="rounded-xl bg-white/10 h-20 shadow-neu-inset" />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/10 h-16 shadow-neu-inset" />
              <div className="rounded-xl bg-white/10 h-16 shadow-neu-inset" />
            </div>
            <div className="mt-auto h-2 w-2/3 mx-auto rounded-full bg-lime/40" />
          </motion.div>

          {/* Floating neumorphic chips — skeuomorphism + neumorphism */}
          <motion.div
            style={{ y: chipY }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="absolute -left-6 md:-left-12 top-8 animate-float rounded-2xl bg-teal-light px-4 py-3 shadow-neu flex items-center gap-2"
          >
            <TrendingUp size={16} className="text-lime" />
            <div className="text-left">
              <p className="text-sm font-bold text-cream">92%</p>
              <p className="text-[10px] text-cream/60">avg score lift</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="absolute -right-4 md:-right-10 bottom-6 animate-float [animation-delay:-2s] rounded-2xl bg-teal-light px-4 py-3 shadow-neu flex items-center gap-2"
          >
            <Users2 size={16} className="text-lime" />
            <div className="text-left">
              <p className="text-sm font-bold text-cream">50+</p>
              <p className="text-[10px] text-cream/60">universities</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
