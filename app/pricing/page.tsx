import type { Metadata } from "next";
import Navbar from "@/components/home/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import Testimonials from "@/components/home/testimonial";
import { Footer } from "@/components/home/footer";

export const metadata: Metadata = {
  title: "Pricing | ShortsVid",
  description:
    "Simple, transparent pricing for ShortsVid. Choose the perfect plan to scale your faceless channel.",
  alternates: { canonical: "https://shortsvid.pro/pricing" },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-10">
        <PricingSection />
      </div>
      <div className="pb-10">
        <Testimonials />
      </div>
      <Footer />
    </main>
  );
}
