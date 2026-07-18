import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/instrument-serif/400.css";
import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import WaveBackground from "@/components/dashboard/WaveBackground";

export const metadata: Metadata = {
  title: "ComplexOne — One platform. Every student journey.",
  description:
    "AI coaching, CBT prep, career discovery, hostel booking, and research support — built for Nigerian students.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ComplexOne",
  },
};

export const viewport = {
  themeColor: "#0D3B2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="font-[family-name:var(--font-jakarta)] antialiased bg-cream">
          <WaveBackground />
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
