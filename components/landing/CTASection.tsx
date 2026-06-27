"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section id="about" className="relative bg-teal-deep py-28 overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-lime/15 blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-teal-light/60 blur-3xl animate-blob [animation-delay:-6s]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center rounded-[2rem] border border-white/15 bg-white/[0.06] backdrop-blur-2xl shadow-glass-lg px-8 py-16"
        >
          <h2 className="font-[family-name:var(--font-instrument)] text-5xl text-cream font-light leading-tight">
            Your student journey
            <br />
            starts here.
          </h2>
          <p className="text-base text-cream/70 mt-4 max-w-lg mx-auto">
            Join thousands of Nigerian students using ComplexOne to study smarter, find
            opportunities, and build their future.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-lime text-teal-deep font-semibold px-8 py-4 rounded-full mt-8 text-base shadow-skeu active:shadow-skeu-pressed transition-shadow"
          >
            Create free account
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
