import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ComplexOne — One platform. Every student journey.",
  description:
    "AI coaching, CBT prep, career discovery, hostel booking, and research support — built for Nigerian students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
