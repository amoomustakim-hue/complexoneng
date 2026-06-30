"use client";

import { motion, type Variants } from "framer-motion";
import { Quote } from "lucide-react";

type Testimonial = {
  quote: string;
  name: string;
  detail: string;
  initials: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      "The CBT mocks felt exactly like the real JAMB. My coach kept flagging the same weak topic until I actually fixed it.",
    name: "Amaka O.",
    detail: "Pre-degree, awaiting admission",
    initials: "AO",
  },
  {
    quote:
      "I found a scholarship with three days left on the deadline because of the urgency badge. Without it I'd have missed it completely.",
    name: "Tunde B.",
    detail: "200L, Computer Science",
    initials: "TB",
  },
  {
    quote:
      "The proposal builder gave me a structure to argue with instead of a blank page. Cut my first-draft time in half.",
    name: "Chiamaka N.",
    detail: "Postgraduate researcher",
    initials: "CN",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Testimonials() {
  return (
    <section className="relative bg-cream py-28 overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-1/3 h-80 w-80 rounded-full bg-lime/15 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest text-teal text-center"
        >
          STUDENT VOICES
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-teal text-center mt-3"
        >
          Real journeys, real progress
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-glass p-6 flex flex-col"
            >
              <Quote className="text-lime" size={22} />
              <p className="text-sm text-teal mt-4 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-cream text-xs font-bold shadow-skeu">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-teal">{t.name}</p>
                  <p className="text-xs text-muted">{t.detail}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
