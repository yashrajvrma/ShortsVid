import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles, Zap, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/json-ld";
import { TOOLS } from "@/config/tools";

export const metadata: Metadata = {
  title: "Free AI Video Tools",
  description:
    "Free AI-powered video creation tools — faceless shorts generator, brainrot maker, TikTok transcript, iMessage generator & more. No account needed to explore.",
  openGraph: {
    title: "Free AI Video Tools — ShortsVid",
    description:
      "All the AI video creation tools you need to grow your channel. Free to try.",
    type: "website",
    url: "https://shortsvid.pro/tools",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools",
  },
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free AI Video Creation Tools",
  description:
    "A collection of free AI-powered tools for creating viral short-form videos.",
  url: "https://shortsvid.pro/tools",
  itemListElement: TOOLS.filter((t) => t.live).map((tool, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: tool.title,
    description: tool.description,
    url: `https://shortsvid.pro${tool.href}`,
  })),
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
      name: "Are these AI video tools free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can explore and try all our AI video creation tools for free. Generating and downloading videos requires a free account, which comes with initial credits. Paid plans are available for creators needing higher volume.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need any video editing experience?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No editing experience is required. Our tools are designed to automate the entire video creation process—from scriptwriting and voiceovers to adding captions and background visuals.",
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
      name: "What platforms can I post to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YouTube Shorts, TikTok, Instagram Reels, and Facebook Reels. Every video is exported in 9:16 vertical format so it looks native on all of them. Generate once, post everywhere.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use these videos for commercial purposes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. You own the commercial rights to the videos you generate, meaning you can post them on YouTube, TikTok, Instagram, or use them for client projects.",
      },
    },
    {
      "@type": "Question",
      name: "How often are new tools added?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We are constantly developing new tools based on creator feedback and current trends. Tools marked as 'Coming Soon' are currently in active development.",
      },
    },
    {
      "@type": "Question",
      name: "How can ShortsVid transform my content creation game?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ShortsVid is your secret weapon for creating irresistible vertical videos in a snap. Our AI-powered platform helps you produce high-quality content consistently without spending hours editing, allowing you to focus on strategy and growth.",
      },
    },
    {
      "@type": "Question",
      name: "How much control do I have over the AI-generated content?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While our AI handles the heavy lifting, you remain completely in the driver's seat. You can edit the AI-generated scripts, choose specific voiceovers, select background visuals, and adjust captions to ensure the final video perfectly matches your brand and vision.",
      },
    },
    {
      "@type": "Question",
      name: "How does ShortsVid compare to other video creation tools?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike traditional video editors that require technical skills and hours of manual work, ShortsVid automates the entire process from idea to final render. It is purpose-built for short-form platforms like TikTok and YouTube Shorts, optimizing for high engagement and watch time.",
      },
    },
    {
      "@type": "Question",
      name: "How can ShortsVid help me grow my audience and business?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Consistency is the key to algorithm success. By drastically reducing the time and effort required to produce videos, ShortsVid enables you to post daily. This consistent output helps you reach wider audiences, build trust, and ultimately drive more traffic and conversions.",
      },
    },
    {
      "@type": "Question",
      name: "What technical requirements do I need to use ShortsVid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ShortsVid is a cloud-based platform that works in any modern web browser (Chrome, Safari, Edge, Firefox). There is no software to download or install, and you don't need a high-end computer because all the heavy video rendering happens on our fast cloud servers.",
      },
    },
    {
      "@type": "Question",
      name: "Is my data safe with ShortsVid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We employ industry-standard encryption and security measures to protect your account and data. Your generated videos, scripts, and account details are secure.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel my subscription at any time?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you can easily cancel your subscription at any time directly from your account settings. You will continue to have access to your plan's features until the end of your current billing cycle.",
      },
    },
  ],
};

export default function ToolsHubPage() {
  return (
    <>
      <JsonLd data={itemListSchema} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 to-background px-4 pt-12 pb-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            All Tools — Free to Try
          </div> */}
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            Free AI Video
            <br />
            Creation Tools
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Everything you need to create viral short-form content — faceless
            videos, brainrot clips, transcripts, and more. No camera. No editing
            skills. Just results.
          </p>
        </div>
      </section>

      {/* ── All Tools ── */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;

            // Shared card content
            const CardContent = (
              <>
                {!tool.live && (
                  <span className="absolute top-4 right-4 text-[10px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
                {tool.badge && tool.live && (
                  <span className="absolute top-4 right-4 text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {tool.badge}
                  </span>
                )}

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${tool.iconBg} ${tool.live ? "transition-transform group-hover:scale-110" : ""}`}
                >
                  <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-base text-foreground mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {tool.live && (
                  <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Open tool <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                )}
              </>
            );

            if (tool.live) {
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  id={`tool-card-${tool.slug}`}
                  className="group relative flex flex-col gap-4 bg-card border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  {CardContent}
                </Link>
              );
            }

            return (
              <div
                key={tool.slug}
                className="relative flex flex-col gap-4 bg-card border border-border rounded-2xl p-6 opacity-55 select-none cursor-default"
              >
                {CardContent}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-4 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-medium tracking-tight mb-3">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our AI video tools.
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
        <div className="relative overflow-hidden bg-black rounded-3xl px-8 py-12 text-center text-primary-foreground">
          {/* Decorative glow blobs */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
              Ready to go viral?
            </h2>
            <p className="text-primary-foreground/80 text-base mb-8 max-w-xl mx-auto tracking-tight">
              Join 100K+ creators making viral short-form content every day.
              Start for free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/app"
                id="tools-hub-cta-btn"
                className="inline-flex items-center justify-center gap-2 bg-primary text-secondary-foreground font-medium px-7 py-3 rounded-xl transition-colors text-base tracking-tight"
              >
                Start creating for Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
