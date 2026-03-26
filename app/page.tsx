import { FAQ } from "@/components/home/faq";
import { ProductFeatures } from "@/components/home/product-features";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import { ViewsShowcase } from "@/components/home/views-showcase";
import { TestimonialDemo } from "@/components/home/testimonial-demo";

export default async function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProductFeatures />

      <ViewsShowcase />
      <TestimonialDemo />
      {/* <SocialProofSection /> */}
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  );
}
