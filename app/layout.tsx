import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Plus_Jakarta_Sans, Instrument_Serif } from "next/font/google";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: "400",
});

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
        <body
          className={`${plusJakarta.variable} ${instrumentSerif.variable} font-[family-name:var(--font-jakarta)] antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
