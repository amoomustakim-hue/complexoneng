"use client";

import { motion, type Variants } from "framer-motion";
import {
  BookOpen,
  Briefcase,
  FlaskConical,
  ShoppingBag,
  Users,
  IdCard,
  type LucideIcon,
} from "lucide-react";

type Feature = {
  phase: string;
  icon: LucideIcon;
  title: string;
  body: string;
};

const features: Feature[] = [
  {
    phase: "Phase 1",
    icon: BookOpen,
    title: "Academic Success Hub",
    body: "Personal AI coach, CBT mock exams for JAMB, WAEC, NECO, and Post-UTME with performance tracking.",
  },
  {
    phase: "Phase 2",
    icon: Briefcase,
    title: "Career & Future Planning",
    body: "Career discovery engine, scholarship portal, and university admission navigator for Nigerian and international schools.",
  },
  {
    phase: "Phase 3",
    icon: FlaskConical,
    title: "Research Support",
    body: "Proposal guidance, data analysis support, and a research marketplace connecting students with analysts and supervisors.",
  },
  {
    phase: "Phase 4",
    icon: ShoppingBag,
    title: "Student Economy",
    body: "Buy textbooks and laptops, find and book verified student hostels — all through WhatsApp or the app.",
  },
  {
    phase: "Phase 5",
    icon: Users,
    title: "Community & Mentorship",
    body: "Join student communities by interest and book sessions with graduates, lecturers, and professionals.",
  },
  {
    phase: "Phase 6",
    icon: IdCard,
    title: "Digital Portfolio",
    body: "Every student gets a verified profile — academic records, certificates, projects, and research outputs.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Features() {
  return (
    <section id="features" className="relative bg-cream py-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-lime/20 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
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
          Everything a student needs, in one place
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                whileHover={{ y: -6, scale: 1.015 }}
                className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-md shadow-glass hover:shadow-glass-lg transition-shadow p-6 flex flex-col"
              >
                <span className="text-xs bg-teal text-cream font-medium px-3 py-1 rounded-full w-fit shadow-skeu">
                  {feature.phase}
                </span>
                <span className="mt-4 flex h-11 w-11 items-center justify-center rounded-full bg-cream shadow-neu-light">
                  <Icon className="text-teal" size={20} />
                </span>
                <h3 className="font-bold text-lg text-teal mt-3">{feature.title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">{feature.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
