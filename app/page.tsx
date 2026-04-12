import type { Metadata } from "next";
import { FAQ } from "@/components/home/faq";
import { ProductFeatures } from "@/components/home/product-features";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import Navbar from "@/components/home/navbar";
import { PricingSection } from "@/components/home/pricing-section";
import { ViewsShowcase } from "@/components/home/views-showcase";
import { JsonLd } from "@/components/seo/json-ld";
import Testimonials from "@/components/home/testimonial";

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: "ShortsVid - AI Short Video Generator for YouTube, TikTok & Instagram",
  description:
    "Create viral YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. Auto-generate scripts, voiceovers, captions, and background music. No editing skills needed.",
  alternates: { canonical: APP_URL },
  openGraph: {
    url: APP_URL,
    title: "ShortsVid - AI Short Video Generator",
    description:
      "Create viral YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. Auto-generate scripts, voiceovers, captions, and background music.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShortsVid",
  url: APP_URL,
  logo: `${APP_URL}/web-app-manifest-512x512.png`,
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShortsVid",
  url: APP_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${APP_URL}/app?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShortsVid",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  description:
    "AI-powered short video generator for YouTube Shorts, Instagram Reels, and TikTok. Create faceless videos with custom voiceovers, captions, and background music.",
  url: APP_URL,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free plan available. Paid plans start at $19/month.",
  },
  featureList: [
    "AI Script Generation",
    "Text-to-Speech Voiceover",
    "Auto Captions",
    "Background Music Library",
    "Video Style Picker",
    "Faceless YouTube Shorts",
    "Instagram Reels Creator",
    "TikTok Video Generator",
  ],
};

export default async function Home() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <Navbar />
      <Hero />
      <ProductFeatures />
      <ViewsShowcase />
      <Testimonials />
      {/* <SocialProofSection /> */}
      <PricingSection />
      <FAQ />
      <Footer />
    </main>
  );
}
