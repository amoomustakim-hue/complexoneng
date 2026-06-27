import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        teal: "#0D3B2E",
        "teal-deep": "#082019",
        "teal-light": "#16513F",
        cream: "#F5F0DC",
        muted: "#6B7B6E",
        "border-light": "#E2E8E5",
        lime: "#D7FF3F",
        "lime-dim": "#A8CC2E",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)"],
        instrument: ["var(--font-instrument)"],
      },
      boxShadow: {
        // Neumorphic: soft dual-tone extrusion on a teal surface
        neu: "8px 8px 20px rgba(0,0,0,0.35), -6px -6px 16px rgba(255,255,255,0.04)",
        "neu-inset": "inset 6px 6px 14px rgba(0,0,0,0.35), inset -4px -4px 10px rgba(255,255,255,0.05)",
        // Neumorphic on light/cream surfaces
        "neu-light": "8px 8px 16px rgba(180,170,140,0.35), -6px -6px 14px rgba(255,255,255,0.85)",
        "neu-light-inset":
          "inset 5px 5px 10px rgba(180,170,140,0.35), inset -4px -4px 8px rgba(255,255,255,0.85)",
        // Skeuomorphic: tactile raised button with gloss
        skeu: "0 1px 0 rgba(255,255,255,0.4) inset, 0 -3px 8px rgba(0,0,0,0.15) inset, 0 10px 20px -6px rgba(13,59,46,0.45)",
        "skeu-pressed": "0 1px 6px rgba(0,0,0,0.25) inset, 0 1px 0 rgba(255,255,255,0.15) inset",
        // Glassmorphism: soft ambient glow behind frosted panels
        glass: "0 8px 32px rgba(8,32,25,0.25)",
        "glass-lg": "0 20px 60px rgba(8,32,25,0.35)",
        // Claymorphism: large soft blur, matte plasticky depth
        clay: "20px 20px 60px rgba(8,32,25,0.18), -12px -12px 40px rgba(255,255,255,0.6)",
        "clay-dark": "20px 20px 50px rgba(0,0,0,0.4), -10px -10px 30px rgba(255,255,255,0.03)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
      animation: {
        blob: "blob 12s ease-in-out infinite",
        marquee: "marquee 28s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
