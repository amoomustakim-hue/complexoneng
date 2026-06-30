import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import UniversityStrip from "@/components/landing/UniversityStrip";
import StatsBand from "@/components/landing/StatsBand";
import Pillars from "@/components/landing/Pillars";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <UniversityStrip />
      <StatsBand />
      <Pillars />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </>
  );
}
