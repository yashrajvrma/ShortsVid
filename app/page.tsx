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
import WhyChooseUs from "@/components/home/why-choose-us";
import { AutomateShowcase } from "@/components/home/automate-showcase";
import { env } from "@/lib/env";
import CallToAction from "@/components/ctx";

const APP_URL = env.NEXT_PUBLIC_BASE_URL || "https://shortsvid.pro";

export const metadata: Metadata = {
  title: {
    absolute:
      "AI Faceless Shorts Video Generator for TikTok, Instagram and YouTube",
  },
  description:
    "Create viral Faceless YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. Auto-generate scripts, voiceovers, captions, and background music. No editing skills needed.",
  alternates: { canonical: APP_URL },
  openGraph: {
    url: APP_URL,
    title:
      "AI Faceless Shorts Video Generator for TikTok, Instagram and YouTube",
    description:
      "Create viral YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. Auto-generate scripts, voiceovers, captions, and background music. No editing skills needed.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AI Faceless Shorts Video Generator for TikTok, Instagram and YouTube",
    description:
      "Create viral YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. Auto-generate scripts, voiceovers, captions, and background music. No editing skills needed.",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShortsVid",
  url: APP_URL,
  logo: `${APP_URL}/images/web-app-manifest-512x512.webp`,
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

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is ShortsVid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ShortsVid is an AI-powered faceless short video generator. You pick a topic and a visual style, and the app writes the script, generates the voiceover, creates the visuals, adds captions, and puts it all together into a finished video ready to post. No editing skills, no camera, no microphone needed.",
      },
    },
    {
      "@type": "Question",
      name: "Who is ShortsVid for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Content creators who want to post more without burning out, business owners who want to drive traffic through video, affiliate marketers, and anyone who wants consistent video output without doing it all manually.",
      },
    },
    {
      "@type": "Question",
      name: "What platforms can I post to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Every video is exported in 9:16 vertical format so it looks native on all of them. Generate once, post everywhere.",
      },
    },
    {
      "@type": "Question",
      name: "Is AI generated content original? Is it plagiarism free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, completely. Every script is generated fresh based on your inputs and every visual is created specifically for your video. Nothing is copied or pulled from existing content. The video is entirely yours to publish and monetize.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of videos can I make?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Horror stories, motivational speeches, history facts, philosophy breakdowns, mystery stories, life hacks, and more. Each video includes an AI voiceover, animated captions, background visuals, and optional background music.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to show my face?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not at all. ShortsVid creates fully faceless videos with AI visuals, voiceover, and captions. You never need to be on camera or record your own voice.",
      },
    },
    {
      "@type": "Question",
      name: "How long should my videos be?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "30 to 60 seconds is the sweet spot. Long enough to deliver value, short enough that people watch till the end. Watch time percentage matters a lot to the algorithm, so you want videos people actually finish.",
      },
    },
    {
      "@type": "Question",
      name: "Can I post the same video on multiple platforms?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes and you should. Every video is in the 9:16 format which works natively on YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Same file, upload everywhere, more reach for the same effort.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get a refund?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We unfortunately cannot offer refunds because of the high generation costs for AI videos. You can cancel your subscription anytime.",
      },
    },
    {
      "@type": "Question",
      name: "Are my payments secure?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All payments go through Polar, a trusted and secure payment processor. We never see or store your card details on our end.",
      },
    },
  ],
};

export default async function Home() {
  return (
    <main className="min-h-screen bg-background">
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />
      <JsonLd data={softwareSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />
      <Hero />
      <AutomateShowcase />
      <ProductFeatures />
      <WhyChooseUs />
      <Testimonials />
      {/* <SocialProofSection /> */}
      <ViewsShowcase />

      <PricingSection />
      <FAQ />
      <CallToAction link="/tools" />
      <Footer />
    </main>
  );
}
