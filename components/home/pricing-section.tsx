"use client";

import { useState, useTransition } from "react";
import {
  Check,
  Zap,
  Video,
  Mic,
  Film,
  UsersRound,
  Captions,
  Clapperboard,
  Sparkles,
  User,
  ArrowUpCircle,
  Headset,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { createCheckout } from "@/actions/billing/create-checkout";
import { useRouter } from "next/navigation";

type Period = "monthly" | "yearly";
type PlanKey = "BASIC_MONTHLY" | "BASIC_YEARLY" | "PRO_MONTHLY" | "PRO_YEARLY";

const FEATURES = [
  { icon: Zap, label: "Optimized for YouTube Shorts" },
  { icon: Film, label: "Instagram Reels & TikTok Compatibility" },
  { icon: Captions, label: "Faceless Shorts, Fake Text, Split Screen" },
  { icon: Mic, label: "10+ languages" },
  { icon: Mic, label: "40+ AI Voices from Eleven labs" },
  { icon: Film, label: "Story-Driven Short Videos" },
  { icon: Film, label: "Facts-Based Video Shorts" },
  { icon: UsersRound, label: "Gameplay-Focused Shorts" },
  { icon: Captions, label: "Subtitled Video Shorts" },
];

interface Plan {
  key: string;
  name: string;
  tagline: string;
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
    basic_monthly: "BASIC_MONTHLY",
    basic_yearly: "BASIC_YEARLY",
    pro_monthly: "PRO_MONTHLY",
    pro_yearly: "PRO_YEARLY",
  };
  return map[`${planKey}_${period}`];
}

const PLANS: Plan[] = [
  {
    key: "free",
    name: "Free",
    tagline: "Limited access",
    description: "",
    monthlyPrice: 0,
    monthlyOldPrice: 0,
    yearlyPrice: 0,
    yearlyOldPrice: 0,
    monthlyCredits: 5,
    yearlyCredits: 60,
    videosPerMonth: 1,
  },
  {
    key: "basic",
    name: "Basic",
    tagline: "For Beginners",
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
    tagline: "For Short-Form Creators",
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

  const router = useRouter();

  const isYearly = period === "yearly";

  const handleSubscribe = (planKey: string) => {
    if (planKey === "free") {
      router.push("/app");
      return;
    }
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
          <p className="text-4xl tracking-tight font-semibold font-serif">
            Plans that works best for your
          </p>
          <p className="text-xl text-muted-foreground py-2">
            Replace 8+ tools with a simple AI workflow
          </p>

          <div className="flex justify-center items-center mt-3">
            <div className="bg-muted/50 p-1 rounded-[12px] flex items-center border border-border">
              <button
                onClick={() => setPeriod("monthly")}
                className={cn(
                  "px-4 py-2 rounded-[8px] text-sm font-medium transition-all",
                  !isYearly
                    ? "bg-[#FF5A00] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setPeriod("yearly")}
                className={cn(
                  "px-6 py-2 rounded-[8px] text-sm font-medium transition-all flex items-center gap-2",
                  isYearly
                    ? "bg-[#FF5A00] text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Yearly Billing
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-sm font-semibold",
                    isYearly
                      ? "bg-white text-foreground"
                      : "bg-primary text-secondary-foreground",
                  )}
                >
                  Save 40%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-6 gap-12 max-w-md lg:max-w-full mx-auto">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const oldPrice = isYearly
              ? plan.yearlyOldPrice
              : plan.monthlyOldPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

            const resolvedPlanKey = getPlanKey(plan.key, period);
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

                  <p className="text-sm font-medium text-muted-foreground">
                    {plan.tagline}
                  </p>
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
                  {price > 0 ? (
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
                    {isLoading
                      ? "Redirecting..."
                      : plan.key === "free"
                        ? "Start for Free"
                        : "Subscribe →"}
                  </Button>

                  {/* Videos per month/year pill */}
                  <div className="mt-5">
                    {plan.key === "free" ? (
                      <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground w-fit">
                        <Video className="w-3.5 h-3.5" />1 Short Video
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground w-fit">
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
                      ) : plan.key === "free" ? (
                        <>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Video className="w-4 h-4 text-emerald-500 shrink-0" />
                            1 Short Video
                          </li>
                          <li className="flex items-center gap-2.5 text-sm text-foreground">
                            <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                            5 Credits
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

                  {plan.key !== "free" && (
                    <div className="mt-auto pt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Cancel at anytime.
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
