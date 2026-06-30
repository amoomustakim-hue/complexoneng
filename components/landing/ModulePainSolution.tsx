"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  AlertTriangle,
  Check,
  BookOpen,
  Brain,
  LineChart,
  Compass,
  Award,
  GraduationCap,
  Briefcase,
  FileText,
  Quote,
  Users,
  type LucideIcon,
} from "lucide-react";

const ICONS = {
  BookOpen,
  Brain,
  LineChart,
  Compass,
  Award,
  GraduationCap,
  Briefcase,
  FileText,
  Quote,
  Users,
} satisfies Record<string, LucideIcon>;

type SolutionPoint = {
  icon: keyof typeof ICONS;
  title: string;
  body: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function ModulePainSolution({
  eyebrow,
  headline,
  subcopy,
  painHeading,
  painPoints,
  solutionHeading,
  solutionPoints,
}: {
  eyebrow: string;
  headline: React.ReactNode;
  subcopy: string;
  painHeading: string;
  painPoints: string[];
  solutionHeading: string;
  solutionPoints: SolutionPoint[];
}) {
  return (
    <>
      <section className="relative bg-teal-deep min-h-[55vh] flex items-center overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-lime/20 blur-3xl animate-blob" />
          <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-light/40 blur-3xl animate-blob [animation-delay:-4s]" />
        </div>

        <div className="relative max-w-2xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-4 py-1.5 shadow-glass">
            <span className="text-xs tracking-widest text-cream/80">{eyebrow}</span>
          </div>
          <h1 className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl text-cream font-light leading-[1.1] mt-6">
            {headline}
          </h1>
          <p className="text-base text-cream/70 mt-5 max-w-lg mx-auto">{subcopy}</p>
        </div>
      </section>

      <section className="relative bg-cream py-20">
        <div className="max-w-3xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-teal text-center"
          >
            {painHeading}
          </motion.h2>
          <div className="flex flex-col gap-4 mt-10">
            {painPoints.map((point, i) => (
              <motion.div
                key={point}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="flex items-start gap-3 rounded-xl border border-white/60 bg-white/70 backdrop-blur-md shadow-glass p-4"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-100 shrink-0">
                  <AlertTriangle size={14} className="text-red-600" />
                </span>
                <p className="text-sm text-teal leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-teal text-center"
          >
            {solutionHeading}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
            {solutionPoints.map((sp, i) => {
              const Icon = ICONS[sp.icon];
              return (
                <motion.div
                  key={sp.title}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-40px" }}
                  className="rounded-2xl border border-border-light bg-cream/60 p-5 flex flex-col gap-2"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal shadow-skeu">
                    <Icon className="text-lime" size={18} />
                  </span>
                  <p className="font-bold text-teal mt-1">{sp.title}</p>
                  <p className="text-sm text-muted leading-relaxed">{sp.body}</p>
                  <span className="flex items-center gap-1 text-xs text-teal font-semibold mt-1">
                    <Check size={12} strokeWidth={3} className="text-lime" />
                    Built in
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-teal-deep py-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-lime/15 blur-3xl animate-blob" />
        </div>
        <div className="relative max-w-xl mx-auto px-6 text-center">
          <h2 className="font-[family-name:var(--font-instrument)] text-3xl text-cream font-light">
            Ready to stop guessing?
          </h2>
          <Link
            href="/sign-up"
            className="inline-block bg-lime text-teal-deep font-semibold px-8 py-4 rounded-full mt-6 text-base shadow-skeu active:shadow-skeu-pressed transition-shadow"
          >
            Get started free
          </Link>
        </div>
      </section>
    </>
  );
}
