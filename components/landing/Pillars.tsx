"use client";

import { motion, type Variants } from "framer-motion";
import { BookOpen, Briefcase, FlaskConical, Check, type LucideIcon } from "lucide-react";

type Pillar = {
  icon: LucideIcon;
  tag: string;
  title: string;
  body: string;
  points: string[];
  stat: { value: string; label: string };
};

const pillars: Pillar[] = [
  {
    icon: BookOpen,
    tag: "ACADEMIC SUCCESS",
    title: "Study with an AI coach that knows your exam.",
    body: "CBT mock exams for JAMB, WAEC, NECO, and Post-UTME, paired with a personal coach that tracks your weak topics and adapts every session.",
    points: [
      "Personal AI study coach available any time",
      "Realistic CBT mocks across major Nigerian exams",
      "Performance tracking with weak-topic insights",
    ],
    stat: { value: "92%", label: "avg score lift" },
  },
  {
    icon: Briefcase,
    tag: "CAREER & FUTURE",
    title: "Go from undecided to admitted, one step at a time.",
    body: "Discover careers that fit you, find scholarships before they close, and track every university application on a single board.",
    points: [
      "AI career discovery quiz with instant insight",
      "Scholarship search with closing-soon urgency badges",
      "Admission tracker — Researching to Admitted",
      "Internship listings, tracker, and CV generator",
    ],
    stat: { value: "50+", label: "universities" },
  },
  {
    icon: FlaskConical,
    tag: "RESEARCH SUPPORT",
    title: "Postgraduate research, without the guesswork.",
    body: "Draft structured proposals, format citations correctly the first time, and connect with analysts and supervisors who can help.",
    points: [
      "AI proposal builder for structured first drafts",
      "Citation formatter — APA, MLA, Harvard, Vancouver",
      "Research marketplace to request or offer help",
    ],
    stat: { value: "24/7", label: "AI assistant" },
  },
];

const fadeSide: Variants = {
  hidden: (fromRight: boolean) => ({ opacity: 0, x: fromRight ? 40 : -40 }),
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Pillars() {
  return (
    <section id="features" className="relative bg-white py-28 overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-teal/5 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest text-teal text-center"
        >
          WHAT&apos;S INSIDE
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-teal text-center mt-3"
        >
          Three pillars, one student journey
        </motion.h2>

        <div className="mt-24 flex flex-col gap-28">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const reversed = i % 2 === 1;
            return (
              <div
                key={pillar.title}
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-16 ${
                  reversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <motion.div
                  custom={reversed}
                  variants={fadeSide}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex-1 w-full"
                >
                  <div className="relative rounded-[2rem] border border-border-light bg-cream/60 shadow-clay p-6">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-teal/30" />
                      <span className="h-2.5 w-2.5 rounded-full bg-teal/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-teal/20" />
                    </div>
                    <div className="mt-4 rounded-xl bg-white h-24 shadow-neu-light-inset flex items-center px-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal shadow-skeu shrink-0">
                        <Icon className="text-lime" size={18} />
                      </span>
                      <div className="ml-4 flex-1">
                        <div className="h-2 w-2/3 rounded-full bg-teal/15" />
                        <div className="h-2 w-1/2 rounded-full bg-teal/10 mt-2" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="rounded-xl bg-white h-20 shadow-neu-light-inset" />
                      <div className="rounded-xl bg-white h-20 shadow-neu-light-inset" />
                    </div>
                    <div className="absolute -bottom-5 -right-4 rounded-2xl bg-teal-deep px-4 py-3 shadow-neu flex items-center gap-2">
                      <span className="font-bold text-cream text-sm">{pillar.stat.value}</span>
                      <span className="text-[10px] text-cream/60">{pillar.stat.label}</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  custom={!reversed}
                  variants={fadeSide}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-80px" }}
                  className="flex-1 w-full"
                >
                  <span className="text-xs bg-teal text-cream font-medium px-3 py-1 rounded-full shadow-skeu">
                    {pillar.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold text-teal mt-4 leading-snug">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-muted mt-3 leading-relaxed max-w-md">{pillar.body}</p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {pillar.points.map((point, pi) => (
                      <motion.li
                        key={point}
                        custom={pi}
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="flex items-start gap-3 text-sm text-teal"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lime/30 shrink-0 mt-0.5">
                          <Check size={12} className="text-teal" strokeWidth={3} />
                        </span>
                        {point}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
