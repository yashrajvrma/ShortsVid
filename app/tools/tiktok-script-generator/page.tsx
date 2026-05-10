import type { Metadata } from "next";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import {
  CheckCircle2,
  Globe,
  Mic,
  Captions,
  Film,
  ChevronRight,
  Sparkles,
  Clock3,
  Zap,
  ArrowRight,
  MessageSquare,
  Users,
  Copy,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HydrateClient } from "@/trpc/server";
import { TOOLS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import ScriptToolUi from "@/components/tools/tiktok-script/script-tool-ui";

export const metadata: Metadata = {
  title: "Free TikTok Script Generator | Write Viral Scripts in Seconds",
  description:
    "Use our free TikTok Script Generator to write highly engaging, fast-paced scripts for your videos. Perfect for shorts, reels, and TikToks.",
  openGraph: {
    title: "Free TikTok Script Generator — ShortsVid",
    description:
      "Write scroll-stopping, viral scripts in seconds with our free AI TikTok script generator. Just enter a topic and duration.",
    type: "website",
    url: "https://shortsvid.pro/tools/tiktok-script-generator",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools/tiktok-script-generator",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the TikTok script generator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply select a topic, choose your target duration (like 60 seconds), and optionally add any specific instructions. Our AI instantly writes a fast-paced, highly engaging script tailored for short-form video.",
      },
    },
    {
      "@type": "Question",
      name: "Is this tool free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! You can generate your first 2 scripts completely free without even signing up. After that, you can sign in and use your account credits to generate more.",
      },
    },
    {
      "@type": "Question",
      name: "How many words are in a 60-second script?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The ideal speaking rate for TikToks and Shorts is about 150 words per minute. Our script generator automatically optimizes the word count to match your selected duration perfectly.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use these scripts for YouTube Shorts or Instagram Reels?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. The scripts are designed with strong hooks, fast pacing, and clear calls-to-action, which are the fundamental elements of any viral short-form video on any platform.",
      },
    },
    {
      "@type": "Question",
      name: "What makes a good TikTok script?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A viral script needs a powerful 3-second hook, zero fluff, fast pacing, and a strong call-to-action at the end. Our AI is explicitly trained to follow this exact framework.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShortsVid TikTok Script Generator",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Free AI TikTok script generator that writes viral, highly engaging short-form video scripts based on your topic and duration.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
  url: "https://shortsvid.pro/tools/tiktok-script-generator",
};

const STEPS = [
  {
    step: "01",
    icon: Globe,
    title: "Select your topic",
    description:
      "Choose from popular niches like Motivational, History Facts, Horror Stories, or enter any custom idea.",
  },
  {
    step: "02",
    icon: Clock3,
    title: "Set the duration",
    description:
      "Pick how long your video should be. We'll perfectly calculate the exact word count needed.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Add your prompt",
    description:
      "Want a specific hook? Need a call-to-action to sell a product? Just add it in the prompt field.",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Generate script",
    description:
      "Hit generate! Our AI will write a highly engaging, fast-paced script instantly.",
  },
  {
    step: "05",
    icon: Copy,
    title: "Copy & Record",
    description:
      "Copy your script to your teleprompter or paste it into ShortsVid to turn it into an AI video in 1 click.",
  },
];

const FEATURES = [
  { icon: MessageSquare, label: "Viral Hooks" },
  { icon: Clock3, label: "Perfect Timing" },
  { icon: Sparkles, label: "AI Powered" },
  { icon: Zap, label: "Instant Output" },
  { icon: CheckCircle2, label: "Free to Use" },
];

const MORE_TOOLS = TOOLS.filter((t) => t.slug !== "tiktok-script-generator");

export default async function TikTokScriptGeneratorPage() {
  return (
    <HydrateClient>
      <JsonLd data={faqSchema} />
      <JsonLd data={softwareSchema} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 to-background px-4 pt-12 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            Free TikTok Script Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
            Stop staring at a blank page. Generate highly engaging, viral
            scripts for your TikToks, YouTube Shorts, and Instagram Reels in
            seconds. Perfect pacing, zero fluff, and strong hooks guaranteed.
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 bg-card border border-border text-sm text-foreground px-3 py-1.5 rounded-full font-medium"
              >
                <Icon className="w-3.5 h-3.5 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool Component ── */}
      <section id="tool" className="max-w-5xl mx-auto px-4 py-10 scroll-mt-24">
        <ErrorBoundary
          fallback={<div>Something went wrong loading the tool.</div>}
        >
          <Suspense
            fallback={
              <div className="h-[400px] rounded-xl border border-border bg-muted/20 animate-pulse" />
            }
          >
            <ScriptToolUi />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ── Step-by-Step Guide ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-3">
            How to use the TikTok Script Generator
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            From idea to recorded video in record time.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {STEPS.map(({ step, icon: Icon, title, description }) => (
            <div
              key={step}
              className="relative flex flex-col bg-card border border-border rounded-2xl px-6 py-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
            Frequently asked questions
          </h2>
          <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about generating viral scripts.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqSchema.mainEntity.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-2xl px-5"
            >
              <AccordionTrigger className="text-left font-medium text-foreground py-4 hover:no-underline text-lg">
                {faq.name}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pb-4 pt-1">
                {faq.acceptedAnswer.text}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-4 py-6">
        <div className="relative overflow-hidden bg-neutral-900 rounded-3xl px-8 py-12 text-center text-primary-foreground">
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              Turn your script into a video
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto tracking-tight">
              Don't want to record yourself? Use ShortsVid's AI to turn your
              newly generated script into a viral faceless video with AI
              voiceovers in 1 click.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center gap-2 bg-primary text-secondary-foreground font-medium px-7 py-3 rounded-xl transition-colors text-base tracking-tight"
              >
                Create Video for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}
