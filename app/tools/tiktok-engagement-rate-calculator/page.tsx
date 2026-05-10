import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import { TrendingUp, ChevronRight, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HydrateClient } from "@/trpc/server";
import { TOOLS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import TikTokEngagementCalculatorUi from "@/components/tools/tiktok-engagement/engagement-calculator-ui";

export const metadata: Metadata = {
  title: "TikTok Engagement Rate Calculator — Free Tool",
  description:
    "Calculate your TikTok engagement rate instantly. Learn how to measure your content's performance based on likes, comments, and shares. Free TikTok analytics tool.",
  openGraph: {
    title: "Free TikTok Engagement Rate Calculator — ShortsVid",
    description:
      "Measure your TikTok performance with our free engagement calculator. Use our view-based formula to see how viral your content really is.",
    type: "website",
    url: "https://shortsvid.pro/tools/tiktok-engagement-rate-calculator",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools/tiktok-engagement-rate-calculator",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a good engagement rate on TikTok?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "On TikTok, a good engagement rate typically falls between 3% and 9%. Anything above 10% is considered exceptional and often indicates viral potential. Because TikTok is view-driven, engagement rates are generally higher than on platforms like Instagram.",
      },
    },
    {
      "@type": "Question",
      name: "How is TikTok engagement rate calculated?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The standard formula for TikTok is (Likes + Comments + Shares) / Total Views * 100. We use views instead of followers because TikTok's algorithm serves content mostly to the For You Page (FYP) rather than just your existing followers.",
      },
    },
    {
      "@type": "Question",
      name: "Why should I use views instead of followers to calculate engagement?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Unlike Instagram, where most reach comes from followers, TikTok is an interest-based platform. A video can get millions of views even if the creator has zero followers. Using views as the denominator gives you a much more accurate picture of how that specific video performed.",
      },
    },
    {
      "@type": "Question",
      name: "Does engagement rate affect the TikTok algorithm?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, significantly. High engagement (especially shares and watch time) signals to TikTok that your content is valuable, prompting the algorithm to push it to a wider audience on the For You Page.",
      },
    },
    {
      "@type": "Question",
      name: "How can I improve my TikTok engagement rate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Post consistently (at least 3 to 5 times per week), use strong hooks in the first 1 to 2 seconds, ask questions or include calls to action in your captions, reply to comments to boost comment counts, post when your audience is most active, and create content that encourages shares and saves. Using trending sounds and hashtags also helps initial distribution. For consistent, high quality content, try ShortsVid's AI video generator to automate your TikTok content creation.",
      },
    },
  ],
};

const MORE_TOOLS = TOOLS.filter(
  (t) => t.slug !== "tiktok-engagement-rate-calculator",
);

export default async function TikTokEngagementPage() {
  return (
    <HydrateClient>
      <JsonLd data={faqSchema} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 to-background px-4 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            TikTok Analytics Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-3">
            TikTok Engagement Rate Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Measure how well your content is performing. Use our view-based
            formula to calculate your real engagement rate and benchmark against
            competitors.
          </p>
        </div>
      </section>

      {/* ── Tool Section ── */}
      <section id="tool" className="max-w-6xl mx-auto px-4 py-5 scroll-mt-24">
        <ErrorBoundary fallback={<div>Error loading calculator.</div>}>
          <Suspense
            fallback={
              <div className="h-[500px] rounded-3xl border border-border bg-muted/20 animate-pulse" />
            }
          >
            <TikTokEngagementCalculatorUi />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ── Formula Section ── */}
      <section className="max-w-4xl mx-auto px-4 py-20 space-y-12">
        <div className="space-y-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tighter text-foreground font-serif leading-[1.2]">
            Calculating Engagement Rate For TikTok Influencers
          </h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            <p>
              To calculate a TikTok account's engagement rate, take the total
              number of engagements (likes + comments + shares) on a video,
              divide by the total number of views, then multiply by 100.
            </p>
            <p>
              Using this formula, you'll be able to view the true performance
              and virality potential for any given piece of content on the
              platform.
            </p>
            <p>
              ShortsVid uses this exact view-based formula to calculate
              engagement rate, ensuring you get the most accurate insights.
            </p>
          </div>
        </div>

        <div className="bg-muted/30 p-6 sm:p-10 rounded-3xl max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-center">
            <span className="font-medium text-xl sm:text-2xl text-foreground shrink-0">
              Engagement rate =
            </span>
            <div className="flex flex-col text-center w-full">
              <span className="font-medium text-lg pb-3 border-b-2 border-foreground/20 px-2 leading-tight">
                Total engagements (likes + comments + shares)
              </span>
              <span className="font-medium text-lg pt-3 px-2">
                Total number of views
              </span>
            </div>
          </div>
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
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-12 border-t border-border mt-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
            Frequently asked questions
          </h2>
          <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about TikTok engagement metrics.
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
                {faq.name === "How can I improve my TikTok engagement rate?" ? (
                  <>
                    Post consistently (at least 3 to 5 times per week), use strong hooks in the first 1 to 2 seconds, ask questions or include calls to action in your captions, reply to comments to boost comment counts, post when your audience is most active, and create content that encourages shares and saves. Using trending sounds and hashtags also helps initial distribution. For consistent, high quality content, try{" "}
                    <Link href="/app" className="text-primary font-medium hover:underline">
                      ShortsVid's AI video generator
                    </Link>{" "}
                    to automate your TikTok content creation.
                  </>
                ) : (
                  faq.acceptedAnswer.text
                )}
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
              Want to increase your engagement?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto tracking-tight">
              Higher engagement starts with better content. Use our AI to write
              scripts and generate videos that keep viewers hooked.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/app"
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
