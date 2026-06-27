import { Twitter, Instagram, Linkedin } from "@/components/landing/social-icons";

const platformLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const companyLinks = [
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Privacy", href: "#privacy" },
];

export default function Footer() {
  return (
    <footer className="bg-teal pt-16 pb-8 border-t border-cream/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          <div>
            <p className="font-bold text-cream text-xl">ComplexOne</p>
            <p className="text-sm text-cream opacity-60 mt-1">
              One platform. Every student journey.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 text-sm text-cream opacity-70">
            <div className="flex flex-col gap-2">
              <p className="font-semibold opacity-100">Platform</p>
              {platformLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:opacity-80">
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold opacity-100">Company</p>
              {companyLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:opacity-80">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/20 my-8" />

        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs text-cream opacity-50">
          <p>© 2026 ComplexOne — CODEDDEVS TECHNOLOGY LTD · Lagos, Nigeria</p>
          <div className="flex items-center gap-4 opacity-60">
            <a href="#" aria-label="Twitter">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
