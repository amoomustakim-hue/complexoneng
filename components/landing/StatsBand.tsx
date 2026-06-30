"use client";

import { motion, type Variants } from "framer-motion";

const stats = [
  { value: "6", label: "Core modules, one platform" },
  { value: "92%", label: "Average CBT score lift" },
  { value: "50+", label: "Partner universities" },
  { value: "24/7", label: "AI coach availability" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function StatsBand() {
  return (
    <section className="relative bg-teal-deep py-20 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/3 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-teal-light/40 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="text-center"
          >
            <p className="font-[family-name:var(--font-instrument)] text-4xl md:text-5xl text-lime font-light">
              {stat.value}
            </p>
            <p className="text-xs md:text-sm text-cream/60 mt-2 leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
