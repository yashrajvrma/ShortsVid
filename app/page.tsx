import { FaqSection } from "@/components/home/faq";
import { ProductFeatures } from "@/components/home/product-features";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import { SocialProofSection } from "@/components/home/social-proof";
import { ViewsShowcase } from "@/components/home/views-showcase";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  // const session = await auth.api.getSession({
  //   headers: await headers(),
  // });

  // if (!session || !session.user) {
  //   redirect("/login");
  // }

  // TOOD : if session redirect to /app
  // if (session) {
  //   redirect("/app");
  // }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ProductFeatures />

      <ViewsShowcase />
      {/* <SocialProofSection /> */}
      <PricingSection />
      <FaqSection />
      <Footer />
    </main>
  );
}
