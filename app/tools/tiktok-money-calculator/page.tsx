import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Calendar,
  Eye,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HydrateClient, trpc } from "@/trpc/server";
import { TOOLS } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import TikTokCalculatorUi from "@/components/tools/tiktok-calculator/calculator-ui";

export const metadata: Metadata = {
  title: "Free TikTok Money Calculator — Estimate Your Earnings",
  description:
    "Calculate your estimated TikTok earnings based on views and engagement. Discover how much you can make from the TikTok Creator Fund and Rewards Program. Free TikTok earnings estimator.",
  openGraph: {
    title: "Free TikTok Money Calculator — ShortsVid",
    description:
      "Estimate your TikTok revenue instantly. Use our TikTok money calculator to see how much your views are worth based on current CPM rates.",
    type: "website",
    url: "https://shortsvid.pro/tools/tiktok-money-calculator",
  },
  alternates: {
    canonical: "https://shortsvid.pro/tools/tiktok-money-calculator",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does TikTok pay per 1,000 views?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "TikTok payments vary depending on the program. The legacy Creator Fund paid roughly $0.02 to $0.04 per 1,000 views. However, the newer TikTok Creator Rewards Program (for videos over 1 minute) can pay anywhere from $0.40 to $1.00+ per 1,000 qualified views, depending on your audience's region and engagement.",
      },
    },
    {
      "@type": "Question",
      name: "How does the TikTok Money Calculator work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our TikTok earnings estimator uses industry-standard CPM (Cost Per Mille) ranges to calculate your potential revenue. It takes your daily video views and applies different earning tiers—from conservative Creator Fund rates to high-end Creator Rewards Program rates—to give you a realistic daily, monthly, and yearly projection.",
      },
    },
    {
      "@type": "Question",
      name: "How many followers do I need to get paid by TikTok?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "To join the TikTok Creator Rewards Program, you typically need at least 10,000 followers and at least 100,000 authentic video views in the last 30 days. Requirements can vary by region, so always check the latest criteria in your TikTok app under Creator Tools.",
      },
    },
    {
      "@type": "Question",
      name: "What factors affect TikTok earnings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Several factors influence your payout: 1. Viewer Location (high-GDP countries pay more), 2. Engagement Rate (likes, comments, and shares), 3. Video Length (videos over 60 seconds often pay significantly more), and 4. Niche (some topics attract higher-paying advertisers).",
      },
    },
    {
      "@type": "Question",
      name: "Is this TikTok calculator accurate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "While we use real-world data to build our estimator, TikTok's actual payouts are private and fluctuate daily. This tool provides an estimate based on average CPMs and should be used for goal-setting and educational purposes rather than official financial accounting.",
      },
    },
  ],
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ShortsVid TikTok Money Calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  description:
    "Free tool to estimate TikTok creator earnings based on video views, engagement rates, and current CPM tiers.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free to use",
  },
  url: "https://shortsvid.pro/tools/tiktok-money-calculator",
};

const FEATURES = [
  { icon: Eye, label: "View Estimations" },
  { icon: TrendingUp, label: "Engagement Tracking" },
  { icon: DollarSign, label: "Earnings Projection" },
  { icon: Calculator, label: "Precise CPM Tiers" },
  { icon: Zap, label: "Instant Results" },
  { icon: CheckCircle2, label: "Free & Unlimited" },
];

const MORE_TOOLS = TOOLS.filter((t) => t.slug !== "tiktok-money-calculator");

export default async function TikTokCalculatorPage() {
  return (
    <HydrateClient>
      <JsonLd data={faqSchema} />
      <JsonLd data={softwareSchema} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 to-background px-4 pt-16 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6">
            <Calculator className="w-3.5 h-3.5" />
            TikTok Creator Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1] mb-4">
            TikTok Money Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            Wondering how much your TikTok views are worth? Use our estimator to
            calculate your potential earnings from the Creator Fund and Rewards
            Program instantly.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 bg-card border border-border text-sm text-foreground px-4 py-2 rounded-full font-medium shadow-sm"
              >
                <Icon className="w-4 h-4 text-primary" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tool Section ── */}
      <section id="tool" className="max-w-6xl mx-auto px-4 py-10 scroll-mt-24">
        <ErrorBoundary
          fallback={
            <div className="text-center p-12 bg-muted/20 rounded-3xl border border-dashed border-border">
              <p>Something went wrong loading the calculator.</p>
            </div>
          }
        >
          <Suspense
            fallback={
              <div className="h-[400px] rounded-xl border border-border bg-muted/20 animate-pulse" />
            }
          >
            <TikTokCalculatorUi />
          </Suspense>
        </ErrorBoundary>
      </section>

      {/* ── Content Section ── */}
      <section className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground font-serif leading-[1.2]">
            How much does TikTok pay you for views?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            TikTok's payment structure has evolved significantly. Depending on
            your video length and audience location, you can earn through
            several different official programs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              01
            </div>
            <h3 className="text-xl font-bold">Creator Fund</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The legacy program. Typically pays between{" "}
              <strong>$0.02 and $0.04</strong> per 1,000 views. It is being
              phased out in favor of more rewarding programs.
            </p>
          </div>
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              02
            </div>
            <h3 className="text-xl font-bold">Creator Rewards</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The new gold standard for videos over 1 minute. Payouts range from{" "}
              <strong>$0.40 to $1.20</strong> per 1,000 qualified views based on
              retention.
            </p>
          </div>
          <div className="bg-card border border-border p-8 rounded-3xl space-y-4 hover:border-primary/30 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
              03
            </div>
            <h3 className="text-xl font-bold">Brand Deals</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Direct sponsorships. Creators with high engagement can earn{" "}
              <strong>$100 to $5,000+</strong> per post, depending on their
              follower count and niche.
            </p>
          </div>
        </div>

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
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
              Frequently asked questions
            </h2>
            <p className="mt-4 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about TikTok monetization in 2025.
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
        </div>
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
              Join 100K+ creators making unhinged videos every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link
                href="/app"
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
