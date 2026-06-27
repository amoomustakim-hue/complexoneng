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

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${plusJakarta.variable} ${instrumentSerif.variable} font-[family-name:var(--font-jakarta)] antialiased`}
    >
      {children}
    </div>
  );
}
