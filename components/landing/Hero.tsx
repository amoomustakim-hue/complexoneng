import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="bg-teal min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col-reverse md:flex-row items-center gap-12 py-24">
        <div className="md:w-3/5 w-full">
          <p className="text-xs tracking-widest text-cream opacity-70">IDEA POINT · 2026</p>

          <h1 className="font-[family-name:var(--font-instrument)] text-5xl md:text-6xl text-cream font-light leading-tight mt-6">
            One platform.
            <br />
            Every student
            <br />
            journey.
          </h1>

          <p className="text-lg text-cream opacity-75 mt-6 max-w-lg">
            AI coaching, CBT prep, career discovery, hostel booking, and research support — built
            for Nigerian students.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/sign-up"
              className="bg-cream text-teal font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              Get started free
            </Link>
            <a
              href="#how-it-works"
              className="border border-cream text-cream px-6 py-3 rounded-lg font-semibold hover:bg-cream/10 transition"
            >
              See how it works
            </a>
          </div>

          <p className="text-xs text-cream opacity-50 mt-6">
            Free to start · No credit card required
          </p>
        </div>

        <div className="md:w-2/5 w-full flex justify-center">
          <svg
            viewBox="0 0 400 500"
            className="w-full max-w-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="#F5F0DC" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {/* head */}
              <circle cx="160" cy="120" r="45" />
              {/* hair */}
              <path d="M118 105 C 115 60, 200 50, 200 100 C 205 70, 130 55, 118 105 Z" />
              {/* body */}
              <path d="M160 165 C 120 180, 100 240, 95 320 L 95 420" />
              <path d="M160 165 C 200 180, 230 230, 245 300" />
              {/* shirt */}
              <path d="M105 230 C 130 215, 190 215, 215 235 L 220 340 L 100 340 Z" />
              <path d="M120 250 C 135 255, 145 270, 140 285" />
              <path d="M150 255 C 165 260, 175 275, 170 290" />
              {/* arm raised holding magnifier */}
              <path d="M195 235 C 230 200, 255 150, 270 100" />
              {/* legs */}
              <path d="M120 340 L 110 460" />
              <path d="M190 340 L 200 460" />
              {/* magnifying glass handle */}
              <path d="M270 100 L 295 70" />
              {/* magnifying glass ring */}
              <circle cx="320" cy="170" r="75" transform="rotate(-30 320 170)" />
              <circle cx="295" cy="120" r="75" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
