"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";

const links = [
  { label: "Home", href: "/#home" },
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
];

const moduleLinks = [
  { label: "Academic Success", href: "/modules/academic-success", desc: "CBT, courses & AI coach" },
  { label: "Career & Future", href: "/modules/career-future", desc: "Scholarships & admissions" },
  { label: "Research Support", href: "/modules/research-support", desc: "Proposals & citations" },
  { label: "Mentor Network", href: "/modules/mentor-network", desc: "Find or become a mentor" },
];

const companyLinks = [
  { label: "About", href: "/about", desc: "Our mission and story" },
  { label: "Founder", href: "/founder", desc: "Meet the founder" },
  { label: "Become a mentor", href: "/become-a-mentor", desc: "Join the mentor network" },
  { label: "Privacy", href: "/#privacy", desc: "How we handle your data" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const companyRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModulesOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(e.target as Node)) {
        setCompanyOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        className={`mx-auto max-w-6xl rounded-full border border-white/10 bg-teal-deep/70 backdrop-blur-xl px-6 sm:px-8 flex items-center justify-between shadow-glass-lg transition-shadow ${
          scrolled ? "shadow-glass-lg" : "shadow-glass"
        }`}
      >
        <Link href="#home" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-teal-deep shadow-skeu">
            <Search size={16} strokeWidth={2.5} />
          </span>
          <span className="font-bold text-cream text-base sm:text-lg">ComplexOne</span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/80 hover:text-lime transition-colors"
            >
              {link.label}
            </a>
          ))}

          {/* Modules dropdown */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => setModulesOpen(true)}
            onMouseLeave={() => setModulesOpen(false)}
          >
            <button
              onClick={() => setModulesOpen((v) => !v)}
              className="flex items-center gap-1 text-sm text-cream/80 hover:text-lime transition-colors"
            >
              Modules
              <motion.span
                animate={{ rotate: modulesOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>

            <AnimatePresence>
              {modulesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-60 rounded-2xl border border-white/10 bg-teal-deep/95 backdrop-blur-xl shadow-glass-lg overflow-hidden"
                >
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {moduleLinks.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        onClick={() => setModulesOpen(false)}
                        className="group flex flex-col px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors"
                      >
                        <span className="text-sm font-medium text-cream/90 group-hover:text-lime transition-colors">
                          {m.label}
                        </span>
                        <span className="text-xs text-cream/45 mt-0.5">{m.desc}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Company dropdown */}
          <div
            ref={companyRef}
            className="relative"
            onMouseEnter={() => setCompanyOpen(true)}
            onMouseLeave={() => setCompanyOpen(false)}
          >
            <button
              onClick={() => setCompanyOpen((v) => !v)}
              className="flex items-center gap-1 text-sm text-cream/80 hover:text-lime transition-colors"
            >
              Company
              <motion.span
                animate={{ rotate: companyOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>

            <AnimatePresence>
              {companyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-2xl border border-white/10 bg-teal-deep/95 backdrop-blur-xl shadow-glass-lg overflow-hidden"
                >
                  <div className="p-1.5 flex flex-col gap-0.5">
                    {companyLinks.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        onClick={() => setCompanyOpen(false)}
                        className="group flex flex-col px-3 py-2.5 rounded-xl hover:bg-white/8 transition-colors"
                      >
                        <span className="text-sm font-medium text-cream/90 group-hover:text-lime transition-colors">
                          {m.label}
                        </span>
                        <span className="text-xs text-cream/45 mt-0.5">{m.desc}</span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-cream/90 px-5 py-2 rounded-full hover:bg-white/5 transition"
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
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.header>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="md:hidden mx-auto max-w-6xl mt-3 rounded-3xl border border-white/10 bg-teal-deep/90 backdrop-blur-xl shadow-glass-lg px-6 py-5 flex flex-col gap-4"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/90"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}

          {/* Mobile modules expand */}
          <div>
            <button
              onClick={() => setMobileModulesOpen((v) => !v)}
              className="flex items-center justify-between w-full text-sm text-cream/90"
            >
              Modules
              <motion.span
                animate={{ rotate: mobileModulesOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {mobileModulesOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-1 mt-2 pl-3 border-l border-white/10">
                    {moduleLinks.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="text-sm text-cream/70 hover:text-lime py-1.5 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile company expand */}
          <div>
            <button
              onClick={() => setMobileCompanyOpen((v) => !v)}
              className="flex items-center justify-between w-full text-sm text-cream/90"
            >
              Company
              <motion.span
                animate={{ rotate: mobileCompanyOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
            <AnimatePresence>
              {mobileCompanyOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col gap-1 mt-2 pl-3 border-l border-white/10">
                    {companyLinks.map((m) => (
                      <Link
                        key={m.href}
                        href={m.href}
                        className="text-sm text-cream/70 hover:text-lime py-1.5 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {m.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
