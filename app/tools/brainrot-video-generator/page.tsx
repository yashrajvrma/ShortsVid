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
import BrainrotToolUi from "@/components/tools/brainrot/brainrot-tool-ui";

export const metadata: Metadata = {
  title: "Free AI Brainrot Explainer Video Generator",
  description:
    "Create viral brainrot explainer videos with chaotic scripts, unhinged AI voices, Minecraft parkour backgrounds, and bold captions. Text to brainrot in minutes.",
  openGraph: {
    title: "Free AI Brainrot Explainer Video Generator — ShortsVid",
    description:
      "Generate scroll-stopping brainrot explainer videos with an AI brainrot generator. Pick characters like SpongeBob or Joe Rogan, add Minecraft parkour, and let AI write the script.",
    type: "website",
    url: "https://shortsvid.pro/tools/brainrot-video-generator",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools/brainrot-video-generator",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an AI brainrot explainer video?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An AI brainrot explainer video is a highly engaging, fast-paced short-form video that uses an AI brainrot generator to have AI voices or avatars (like celebrities or meme characters) explain a concept or tell a story over gameplay footage like Minecraft parkour or Subway Surfers.",
      },
    },
    {
      "@type": "Question",
      name: "How does the text to brainrot generator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our text to brainrot tool lets you enter a topic or paste a script. The brainrot video generator then writes a chaotic dialogue, splits it between two characters, syncs the AI voices to a gameplay background, and adds highly visual captions — all automatically in minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to edit the video myself?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No! The brainrot video generator handles everything. It perfectly times the back-and-forth dialogue, applies viral caption styles, and renders the final MP4 video ready to upload to TikTok or YouTube Shorts.",
      },
    },
    {
      "@type": "Question",
      name: "What characters and voices are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can choose from a library of iconic characters including Joe Rogan, SpongeBob, Peter Griffin, Donald Trump, Elon Musk, and many more. Each character has a distinct AI voice to match their persona.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use my own script?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. While you can use our AI to write the script, you can also paste your own custom dialogue line-by-line and assign different characters to read each part.",
      },
    },
    {
      "@type": "Question",
      name: "Are brainrot videos good for TikTok and YouTube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Brainrot content is one of the highest-performing video formats on TikTok and YouTube Shorts due to its high retention rate, engaging gameplay backgrounds, and fast-paced dialogue.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShortsVid Brainrot Explainer Video Generator",
  applicationCategory: "VideoApplication",
  operatingSystem: "Web",
  description:
    "AI brainrot generator that converts text to brainrot explainer videos featuring AI characters, gameplay footage, and chaotic scripts.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier available",
  },
  url: "https://shortsvid.pro/tools/brainrot-video-generator",
};

const STEPS = [
  {
    step: "01",
    icon: Globe,
    title: "Enter your topic",
    description:
      "Type a chaotic topic, meme idea, or paste your own unhinged script into the generator.",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Generate dialogue",
    description:
      "Let our AI write a viral back-and-forth script between two speakers, or write it yourself.",
  },
  {
    step: "03",
    icon: Users,
    title: "Pick characters",
    description:
      "Choose from iconic AI avatars and voices like Joe Rogan, Peter Griffin, or SpongeBob.",
  },
  {
    step: "04",
    icon: Film,
    title: "Select gameplay",
    description:
      "Pick a high-retention background video like Minecraft parkour or Subway Surfers.",
  },
  {
    step: "05",
    icon: Sparkles,
    title: "Generate video",
    description:
      "Hit generate! The AI syncs the voices, background, and captions into a viral masterpiece.",
  },
];

const FEATURES = [
  { icon: Users, label: "Meme Avatars" },
  { icon: Mic, label: "Unhinged AI Voices" },
  { icon: Film, label: "Minecraft Parkour" },
  { icon: Captions, label: "Viral Captions" },
  { icon: MessageSquare, label: "Chaotic Scripts" },
  { icon: Clock3, label: "Ready in Minutes" },
  { icon: CheckCircle2, label: "No Watermark" },
  { icon: Zap, label: "Free to Try" },
];

// Filter out this tool for the "explore more" section
const MORE_TOOLS = TOOLS.filter((t) => t.slug !== "brainrot-video-generator");

export default async function BrainrotVideoGeneratorPage() {
  prefetch(trpc.stocks.getAllBackgroundMusic.queryOptions());
  prefetch(trpc.stocks.getSystemBackgroundVideos.queryOptions());
  prefetch(trpc.stocks.getSystemAiAvatars.queryOptions());
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
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            AI Brainrot Explainer Video Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
            Turn any text to brainrot in minutes. Use our AI brainrot generator to create viral, highly engaging explainer videos with meme characters arguing over Minecraft parkour and Subway Surfers footage. The ultimate brainrot video generator for TikToks and Shorts.
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
            <BrainrotToolUi />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ── Step-by-Step Guide ── */}
      <section className="max-w-5xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-3">
            How to use the Brainrot Explainer Video Generator
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From random idea to viral TikTok in five simple steps.
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
                className={`relative flex flex-col gap-3 bg-card border border-border rounded-2xl p-5 transition-all ${tool.live
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
            Everything you need to know about the AI brainrot generator.
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
              Join 100K+ creators making unhinged brainrot videos every day. Start for
              free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/app"
                id="brainrot-cta-signup-btn"
                className="inline-flex items-center justify-center gap-2 bg-primary text-secondary-foreground font-medium px-7 py-3 rounded-xl transition-colors text-base tracking-tight"
              >
                Start creating for Free
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
