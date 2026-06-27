import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UniversityStrip from "@/components/landing/UniversityStrip";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UniversityStrip />
      <CTASection />
      <Footer />
    </>
  );
}
