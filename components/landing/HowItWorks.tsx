"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Create your account",
    body: "Sign up, choose your academic level, school, and target exam.",
  },
  {
    num: "02",
    title: "Access your tools",
    body: "Your AI coach, CBT practice engine, and career resources are ready immediately.",
  },
  {
    num: "03",
    title: "Grow and connect",
    body: "Find hostels, buy materials, meet mentors, and build your student portfolio.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-white py-28 overflow-hidden">
      <div className="pointer-events-none absolute top-10 right-1/4 h-72 w-72 rounded-full bg-teal/5 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest text-teal text-center"
        >
          HOW IT WORKS
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-teal text-center mt-3"
        >
          Up and running in minutes
        </motion.h2>

        <div className="flex flex-col md:flex-row items-start md:items-center mt-20 gap-12 md:gap-0">
          {steps.map((step, i) => (
            <div key={step.num} className="flex md:flex-1 items-center w-full">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="flex-1"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream shadow-neu-light">
                  <span className="font-[family-name:var(--font-instrument)] text-3xl text-teal font-light">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-teal mt-5">{step.title}</h3>
                <p className="text-sm text-muted mt-1 max-w-xs">{step.body}</p>
              </motion.div>

              {i < steps.length - 1 && (
                <div className="hidden md:block flex-1 h-px mx-4 self-center relative top-[-3.25rem] overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.15 + 0.3, ease: "easeOut" }}
                    style={{ transformOrigin: "left" }}
                    className="h-full bg-gradient-to-r from-lime-dim to-lime"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
