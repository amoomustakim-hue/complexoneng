"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-border-light">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <a href="#home" className="font-bold text-teal text-xl">
          ComplexOne
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-teal hover:opacity-70">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm font-semibold text-teal px-4 py-2 rounded-lg hover:bg-cream/50 transition"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>

        <button
          className="md:hidden text-teal"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-light bg-white px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-teal"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-teal px-4 py-2 rounded-lg border border-border-light text-center"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-teal text-cream px-4 py-2 rounded-lg text-center"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
