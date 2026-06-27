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
        cream: "#F5F0DC",
        muted: "#6B7B6E",
        "border-light": "#E2E8E5",
      },
      fontFamily: {
        jakarta: ["var(--font-jakarta)"],
        instrument: ["var(--font-instrument)"],
      },
    },
  },
  plugins: [],
};
export default config;
