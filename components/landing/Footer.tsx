import Link from "next/link";
import { Search } from "lucide-react";
import { Twitter, Instagram, Linkedin } from "@/components/landing/social-icons";

const moduleLinks = [
  { label: "Academic Success", href: "/modules/academic-success" },
  { label: "Career & Future", href: "/modules/career-future" },
  { label: "Research Support", href: "/modules/research-support" },
];

const platformLinks = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Founder", href: "/founder" },
  { label: "Privacy", href: "/#privacy" },
];

export default function Footer() {
  return (
    <footer className="relative bg-teal-deep pt-16 pb-8 border-t border-white/10 overflow-hidden">
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime text-teal-deep shadow-skeu">
                <Search size={16} strokeWidth={2.5} />
              </span>
              <p className="font-bold text-cream text-xl">ComplexOne</p>
            </div>
            <p className="text-sm text-cream/60 mt-2 max-w-xs">
              One platform. Every student journey.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 sm:gap-12 text-sm text-cream/70">
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-cream">Modules</p>
              {moduleLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-lime transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-cream">Platform</p>
              {platformLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-lime transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-cream">Company</p>
              {companyLinks.map((link) => (
                <Link key={link.label} href={link.href} className="hover:text-lime transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 my-8" />

        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-cream/50">
          <p>© 2026 ComplexOne — CODEDDEVS TECHNOLOGY LTD · Lagos, Nigeria</p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-lime transition"
            >
              <Twitter size={14} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-lime transition"
            >
              <Instagram size={14} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 hover:bg-white/10 hover:text-lime transition"
            >
              <Linkedin size={14} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
