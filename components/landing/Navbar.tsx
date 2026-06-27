"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Search } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 right-0 z-50 px-4"
    >
      <motion.header
        animate={{
          paddingTop: scrolled ? 6 : 10,
          paddingBottom: scrolled ? 6 : 10,
        }}
        transition={{ duration: 0.3 }}
        className={`mx-auto max-w-5xl rounded-full border border-white/10 bg-teal-deep/70 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between shadow-glass-lg transition-shadow ${
          scrolled ? "shadow-glass-lg" : "shadow-glass"
        }`}
      >
        <Link href="#home" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-teal-deep shadow-skeu">
            <Search size={16} strokeWidth={2.5} />
          </span>
          <span className="font-bold text-cream text-base sm:text-lg">ComplexOne</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/80 hover:text-lime transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-cream/90 px-4 py-2 rounded-full hover:bg-white/5 transition"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="group flex items-center gap-1.5 text-sm font-semibold bg-lime text-teal-deep pl-4 pr-1.5 py-1.5 rounded-full shadow-skeu active:shadow-skeu-pressed transition-shadow"
          >
            Get started
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-deep text-lime transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <button
          className="md:hidden text-cream"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.header>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="md:hidden mx-auto max-w-5xl mt-3 rounded-3xl border border-white/10 bg-teal-deep/90 backdrop-blur-xl shadow-glass-lg px-6 py-5 flex flex-col gap-4"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/90"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-cream px-4 py-2 rounded-full border border-white/15 text-center"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-lime text-teal-deep px-4 py-2 rounded-full text-center shadow-skeu"
            >
              Get started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
