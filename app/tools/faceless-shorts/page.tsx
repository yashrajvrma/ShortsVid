import type { Metadata } from "next";

export const revalidate = 1800; // Revalidate every 30 mins to refresh presigned URLs before they expire

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import {
  CheckCircle2,
  Globe,
  Mic,
  Music,
  Captions,
  Film,
  ChevronRight,
  Sparkles,
  Video,
  Clock3,
  Zap,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { LANGUAGES, TOOLS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import FacelessShortsToolUi from "@/components/tools/faceless-shorts/faceless-shorts-tool-ui";

export const metadata: Metadata = {
  title: "Free AI Faceless Shorts Generator",
  description:
    "Create faceless YouTube Shorts with AI voiceover, custom captions & background music. No face, no camera — generate viral videos in minutes. Free to try.",
  openGraph: {
    title: "Free AI Faceless Shorts Generator — ShortsVid",
    description:
      "Generate scroll-stopping faceless YouTube Shorts with AI. Pick a topic, choose a voice, add captions — done in minutes.",
    type: "website",
    url: "https://shortsvid.pro/tools/faceless-shorts",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools/faceless-shorts",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a faceless YouTube Short?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A faceless YouTube Short is a short-form video (under 60 seconds) that doesn't show the creator's face. Instead, it uses AI voiceover, stock footage, gameplay clips, or animated visuals paired with on-screen captions. Faceless channels are one of the fastest-growing niches on YouTube in 2025.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to show my face to create YouTube Shorts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. ShortsVid's faceless shorts generator lets you create fully produced videos without ever appearing on camera. Just enter a topic, pick an AI voice, and the tool generates the script, voiceover, and captions automatically.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to generate a faceless Short?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most faceless Shorts are generated in under 3–5 minutes. The AI writes the script, generates the voiceover audio, syncs captions, and assembles the final video — all automatically.",
      },
    },
    {
      "@type": "Question",
      name: "What video background styles are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ShortsVid offers multiple video styles including Minecraft parkour, satisfying gameplay clips, nature footage, and more. New styles are added regularly. You can preview each style before generating.",
      },
    },
    {
      "@type": "Question",
      name: "Is the faceless shorts generator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — you can explore the full tool for free without signing up. Creating and downloading your generated video requires a free account. Paid plans offer higher monthly video credits for power users.",
      },
    },
    {
      "@type": "Question",
      name: "Can I monetise faceless YouTube Shorts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Faceless Shorts are eligible for YouTube Partner Program monetisation as long as the content is original. Since ShortsVid generates unique scripts and voiceovers for each video, your content qualifies as original. Always review YouTube's monetisation policies before applying.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own voice instead of AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently, ShortsVid provides over 50 high-quality AI voices in multiple languages to streamline the process. Custom voice cloning and audio uploads are on our roadmap for future updates.",
      },
    },
    {
      "@type": "Question",
      name: "What happens if I don't like the generated script?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You have full control over the script before the video is generated. You can let the AI write it, make manual edits, or paste in a completely pre-written script of your own. The video will only use the exact text you approve.",
      },
    },
    {
      "@type": "Question",
      name: "Do I own the rights to the videos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you own full commercial rights to any video you generate using ShortsVid. You can post them on YouTube Shorts, TikTok, Instagram Reels, or use them for client work.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShortsVid Faceless Shorts Generator",
  applicationCategory: "VideoApplication",
  operatingSystem: "Web",
  description:
    "AI-powered faceless YouTube Shorts generator with voiceover, custom captions, background music, and multiple video styles.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
  url: "https://shortsvid.pro/tools/faceless-shorts",
};

const STEPS = [
  {
    step: "01",
    icon: Globe,
    title: "Pick your language & topic",
    description:
      "Choose from 20+ languages and enter your video topic — anything from finance tips to motivational quotes.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "Generate or write your script",
    description:
      "Let the AI write a viral-optimised script for you, or type your own. Edit it until it's exactly right.",
  },
  {
    step: "03",
    icon: Mic,
    title: "Choose a voice & music",
    description:
      "Select from 50+ AI voices across multiple languages. Add optional background music to set the mood.",
  },
  {
    step: "04",
    icon: Film,
    title: "Pick a video style",
    description:
      "Choose a background video style — Minecraft parkour, satisfying gameplay, nature, and more.",
  },
  {
    step: "05",
    icon: Captions,
    title: "Customise captions & generate",
    description:
      "Style your captions with custom fonts, colours, and animations. Hit Generate — your video is ready in minutes.",
  },
];

const FEATURES = [
  { icon: Mic, label: "50+ AI Voices" },
  { icon: Globe, label: "20+ Languages" },
  { icon: Music, label: "Background Music" },
  { icon: Captions, label: "Auto Captions" },
  { icon: Film, label: "Multiple Video Styles" },
  { icon: Clock3, label: "Ready in Minutes" },
  { icon: CheckCircle2, label: "No Watermark" },
  { icon: Zap, label: "Free to Try" },
];

// Filter out this tool for the "explore more" section
const MORE_TOOLS = TOOLS.filter((t) => t.slug !== "faceless-shorts");

export default async function FacelessShortsToolPage() {
  prefetch(trpc.stocks.getAllBackgroundMusic.queryOptions());
  prefetch(
    trpc.voices.getSystemVoice.queryOptions({
      languageCode: LANGUAGES[0].code,
    }),
  );

  return (
    <HydrateClient>
      <JsonLd data={faqSchema} />
      <JsonLd data={softwareSchema} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 to-background px-4 pt-12 pb-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full mb-5">
            <Video className="w-3.5 h-3.5" />
            Free AI Tool
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            AI Faceless Shorts Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
            Create scroll-stopping faceless YouTube Shorts with AI voiceover,
            custom captions, and background music — no face, no camera, no
            editing skills needed!
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
      <section id="tool" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-24">
        <ErrorBoundary
          fallback={<div>Something went wrong loading the tool.</div>}
        >
          <Suspense
            fallback={
              <div className="h-[780px] rounded-xl border border-border bg-muted/20 animate-pulse" />
            }
          >
            <FacelessShortsToolUi />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ── Step-by-Step Guide ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-3">
            How to create a faceless Short
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Five simple steps from blank page to published video.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {STEPS.map(({ step, icon: Icon, title, description }) => (
            <div
              key={step}
              className="relative flex flex-col bg-card border border-border rounded-2xl px-6 py-5 hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-4xl font-bold text-primary/20 leading-none">
                  {step}
                </span>
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

      {/* ── Explore More Tools ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-3">
            Explore more AI tools
          </h2>
          <p className="text-muted-foreground">
            More free tools to supercharge your content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MORE_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.slug}
                className={`relative flex flex-col gap-3 bg-card border border-border rounded-2xl p-5 transition-all ${
                  tool.live
                    ? "hover:border-primary/40 hover:shadow-md cursor-pointer"
                    : "opacity-60 cursor-default"
                }`}
              >
                {!tool.live && (
                  <span className="absolute top-3 right-3 text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                {tool.badge && tool.live && (
                  <span className="absolute top-3 right-3 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${tool.iconBg}`}
                >
                  <Icon className={`w-4.5 h-4.5 ${tool.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-medium text-lg text-foreground mb-0.5">
                    {tool.shortTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
                {tool.live && (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-auto"
                  >
                    Open tool <ChevronRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all tools <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
            Frequently asked questions
          </h2>
          <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about faceless YouTube Shorts.
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
          {/* Decorative glow blobs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              Ready to go viral?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto tracking-tight">
              Join 100K+ creators making unhinged brainrot videos every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/app"
                id="brainrot-cta-signup-btn"
                className="inline-flex items-center justify-center gap-2 bg-primary text-secondary-foreground font-medium px-7 py-3 rounded-xl transition-colors text-base tracking-tight"
              >
                Start creating
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#tool"
                className="inline-flex items-center justify-center gap-2 font-medium px-7 py-3 rounded-xl bg-white/20 transition-colors text-base"
              >
                Try the tool first
              </a>
            </div>
          </div>
        </div>
      </section>
    </HydrateClient>
  );
}
