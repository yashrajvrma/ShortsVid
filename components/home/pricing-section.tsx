"use client";

import { useState, useTransition } from "react";
import {
  Zap,
  Video,
  Mic,
  Film,
  UsersRound,
  Captions,
  User,
  ArrowUpCircle,
  Headset,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createCheckout } from "@/actions/billing/create-checkout";

type Period = "monthly" | "yearly";
type PlanKey =
  | "STARTER_WEEKLY"
  | "BASIC_MONTHLY"
  | "BASIC_YEARLY"
  | "PRO_MONTHLY"
  | "PRO_YEARLY";

const FEATURES = [
  { icon: Zap, label: "Optimized for YouTube Shorts" },
  { icon: Film, label: "Instagram Reels & TikTok Compatibility" },
  { icon: Captions, label: "Faceless Shorts, Fake Text, Split Screen" },
  // { icon: Mic, label: "10+ languages" },
  { icon: Mic, label: "40+ AI Voices from Eleven labs" },
  { icon: Film, label: "Story-Driven Short Videos" },
  { icon: Film, label: "Facts-Based Video Shorts" },
  { icon: UsersRound, label: "Gameplay-Focused Shorts" },
  { icon: Captions, label: "Subtitled Video Shorts" },
];

interface Plan {
  key: string;
  name: string;
  tagline?: string;
  description: string;
  monthlyPrice: number;
  monthlyOldPrice: number;
  yearlyPrice: number;
  yearlyOldPrice: number;
  monthlyCredits: number;
  yearlyCredits: number;
  videosPerMonth: number;
  highlighted?: boolean;
  badge?: string;
}

function getPlanKey(planKey: string, period: Period): PlanKey {
  const map: Record<string, PlanKey> = {
    starter_weekly: "STARTER_WEEKLY",
    basic_monthly: "BASIC_MONTHLY",
    basic_yearly: "BASIC_YEARLY",
    pro_monthly: "PRO_MONTHLY",
    pro_yearly: "PRO_YEARLY",
  };
  // Starter is always weekly regardless of toggle
  if (planKey === "starter") return "STARTER_WEEKLY";
  return map[`${planKey}_${period}`];
}

const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    // tagline: "Try it this week",
    description: "Get a quick glance of the platform",
    monthlyPrice: 9,
    monthlyOldPrice: 0,
    yearlyPrice: 9,
    yearlyOldPrice: 0,
    monthlyCredits: 50,
    yearlyCredits: 50,
    videosPerMonth: 10,
    badge: "WEEKLY",
  },
  {
    key: "basic",
    name: "Basic",
    // tagline: "For Beginners",
    description: "Perfect for getting started with AI short videos.",
    monthlyPrice: 19,
    monthlyOldPrice: 49,
    yearlyPrice: 17,
    yearlyOldPrice: 35,
    monthlyCredits: 150,
    yearlyCredits: 1800,
    videosPerMonth: 30,
    highlighted: true,
    badge: "LIMITED OFFER",
  },
  {
    key: "pro",
    name: "Pro",
    // tagline: "For Short-Form Creators",
    description: "Best for creators making Shorts, Reels & TikToks.",
    monthlyPrice: 67,
    monthlyOldPrice: 99,
    yearlyPrice: 58,
    yearlyOldPrice: 85,
    monthlyCredits: 500,
    yearlyCredits: 6000,
    videosPerMonth: 100,
    badge: "BEST VALUE",
  },
];

export function PricingSection() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [pendingPlanKey, setPendingPlanKey] = useState<PlanKey | null>(null);
  const [isPending, startTransition] = useTransition();

  const isYearly = period === "yearly";

  const handleSubscribe = (planKey: string) => {
    const resolvedPlanKey = getPlanKey(planKey, period);
    setPendingPlanKey(resolvedPlanKey);
    startTransition(async () => {
      await createCheckout(resolvedPlanKey);
      setPendingPlanKey(null);
    });
  };

  return (
    <section
      id="pricing"
      className="w-full sm:py-20 py-12 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center sm:mb-20 mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-foreground font-serif leading-[1.2]">
            Plans & Pricing
          </h2>
          <p className="mt-3 sm:text-xl text-base text-muted-foreground max-w-2xl mx-auto">
            {/* Replace 8+ tools with a simple AI workflow */}
            Get more credits and premium features based on your ShortsVid AI
            plan.
          </p>

          <div className="flex justify-center items-center gap-3 mt-6">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                !isYearly ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Monthly
            </span>

            {/* Toggle */}
            <button
              role="switch"
              aria-checked={isYearly}
              onClick={() => setPeriod(isYearly ? "monthly" : "yearly")}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isYearly ? "bg-[#FF5A00]" : "bg-muted-foreground/40",
              )}
            >
              <span
                className={cn(
                  "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform",
                  isYearly ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>

            <span
              className={cn(
                "text-sm font-medium transition-colors",
                isYearly ? "text-foreground" : "text-muted-foreground",
              )}
            >
              Yearly
            </span>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-orange-50 text-orange-500 border border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400">
              save up to 40%
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:gap-6 gap-12 max-w-md lg:max-w-full mx-auto">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const oldPrice = isYearly
              ? plan.yearlyOldPrice
              : plan.monthlyOldPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

            // Starter is always weekly regardless of the monthly/yearly toggle
            const resolvedPlanKey =
              plan.key === "starter"
                ? "STARTER_WEEKLY"
                : getPlanKey(plan.key, period);
            const isLoading = isPending && pendingPlanKey === resolvedPlanKey;

            return (
              <Card
                key={plan.key}
                className={cn(
                  "relative flex flex-col overflow-visible transition-all duration-300 p-6",
                  plan.highlighted
                    ? "border-primary bg-primary/5 shadow-lg sm:scale-105"
                    : "border-border hover:border-primary/40",
                )}
              >
                {/* Top badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-4">
                    <span
                      className={cn(
                        "text-sm font-semibold tracking-tight uppercase px-3 py-1 rounded-sm",
                        plan.highlighted
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground border border-border",
                      )}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  {/* Plan name row — without inline toggle */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tighter">
                      {plan.name}
                    </h3>
                  </div>

                  {/* <p className="text-sm font-medium text-muted-foreground">
                    {plan.tagline}
                  </p> */}
                  {plan.description && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {plan.description}
                    </p>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-5">
                    {oldPrice > 0 && (
                      <span className="text-xl font-medium line-through text-muted-foreground">
                        ${oldPrice}
                      </span>
                    )}
                    <div className="flex items-center gap-x-1">
                      <div className="text-5xl font-semibold text-foreground">
                        ${price}
                      </div>
                    </div>
                  </div>
                  {plan.key === "starter" ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed weekly
                    </p>
                  ) : price > 0 ? (
                    <p className="text-sm text-muted-foreground mt-1">
                      Billed today: ${isYearly ? price * 12 : price}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">
                      No credit card required
                    </p>
                  )}

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full mt-5 font-medium text-base tracking-tight"
                    variant={plan.highlighted ? "default" : "outline"}
                    disabled={isLoading}
                    onClick={() => handleSubscribe(plan.key)}
                  >
                    {isLoading ? "Redirecting..." : "Subscribe →"}
                  </Button>

                  {/* Videos per month/year pill */}
                  <div className="mt-5">
                    {plan.key === "starter" ? (
                      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground w-fit">
                        <Video className="w-3.5 h-3.5" />
                        10 Short Videos / week
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-foreground w-fit">
                        <Video className="w-3.5 h-3.5" />
                        {isYearly
                          ? (plan.videosPerMonth * 12).toLocaleString()
                          : plan.videosPerMonth}{" "}
                        Short Videos / {isYearly ? "year" : "month"}
                      </div>
                    )}
                  </div>

                  {/* Get access to */}
                  {/* <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Get access to
                    </p>
                    <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground w-fit">
                      <Clapperboard className="w-3.5 h-3.5 text-primary" />
                      AI Shorts
                    </div>
                  </div> */}

                  {/* Divider */}
                  {/* <div className="my-5 border-t border-border" /> */}

                  {/* Features */}
                  <div className="mt-5 flex-grow">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      {plan.key === "pro"
                        ? "Everything in Basic, and also:"
                        : "What's included:"}
                    </p>
                    <ul className="space-y-2.5">
                      {plan.key === "pro" ? (
                        <>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                            {credits.toLocaleString()} Credits per{" "}
                            {isYearly ? "Year" : "Month"}
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                            {isYearly ? "1,200" : "100"} Short Videos per{" "}
                            {isYearly ? "year" : "month"}
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <User className="w-4 h-4 text-emerald-500 shrink-0" />
                            Custom avatar and background media upload
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Hourglass className="w-4 h-4 text-emerald-500 shrink-0" />
                            Faster Rendering Queue
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <ArrowUpCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            High resolution Output
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Headset className="w-4 h-4 text-emerald-500 shrink-0" />
                            Priority Support
                          </li>
                        </>
                      ) : plan.key === "starter" ? (
                        <>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                            10 Short Videos / week
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                            50 Credits
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Captions className="w-4 h-4 text-emerald-500 shrink-0" />
                            Faceless Shorts, Fake Text, Split Screen
                          </li>
                          {/* <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Mic className="w-4 h-4 text-emerald-500 shrink-0" />
                            10+ languages
                          </li> */}
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Mic className="w-4 h-4 text-emerald-500 shrink-0" />
                            40+ AI Voices from Eleven labs
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Headset className="w-4 h-4 text-emerald-500 shrink-0" />
                            Limited support
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                            {isYearly
                              ? (plan.videosPerMonth * 12).toLocaleString()
                              : plan.videosPerMonth}{" "}
                            Short Videos per {isYearly ? "year" : "month"}
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                            {credits.toLocaleString()} Credits per{" "}
                            {isYearly ? "Year" : "Month"}
                          </li>
                          {FEATURES.map((f) => (
                            <li
                              key={f.label}
                              className="flex items-center gap-2.5 text-sm text-foreground"
                            >
                              <f.icon className="w-4 h-4 text-emerald-500 shrink-0" />
                              {f.label}
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="mt-auto pt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Cancel at anytime.
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
