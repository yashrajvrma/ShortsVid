"use client";

import { useState, useTransition } from "react";
import {
  Zap,
  Video,
  Mic,
  Film,
  Captions,
  Clapperboard,
  UsersRound,
  User,
  ArrowUpCircle,
  Headset,
  Hourglass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createCheckout } from "@/actions/billing/create-checkout";
import { cn } from "@/lib/utils";

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
  { icon: UsersRound, label: "Conversation Gameplay Shorts" },
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

export function PricingModal() {
  const [period, setPeriod] = useState<Period>("monthly");
  const [pendingPlanKey, setPendingPlanKey] = useState<PlanKey | null>(null); // ← add
  const [isPending, startTransition] = useTransition(); // ← add
  const isYearly = period === "yearly";

  // ← Replace the entire checkoutMutation block with this:
  const handleSubscribe = (planKey: string) => {
    if (planKey === "free") {
      window.location.href = "/sign-up";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-4xl px-4 h-screen">
      <div className="w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="sticky top-0 z-10 bg-card border-border px-6 py-8 flex flex-col items-center gap-1 text-center rounded-2xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Subscribe to unlock more features
          </h2>
          <div className="flex justify-center items-center mt-3 mb-2">
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

        <div className="p-10 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
            {PLANS.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const oldPrice = isYearly
                ? plan.yearlyOldPrice
                : plan.monthlyOldPrice;
              const credits = isYearly
                ? plan.yearlyCredits
                : plan.monthlyCredits;

              // ← Replace the old isLoading check with this:
              const resolvedPlanKey = getPlanKey(plan.key, period);
              const isLoading = isPending && pendingPlanKey === resolvedPlanKey;

              return (
                <Card
                  key={plan.key}
                  className={cn(
                    "relative flex flex-col overflow-visible transition-all duration-300 p-5",
                    plan.highlighted
                      ? "border-primary bg-primary/5 shadow-lg sm:scale-105"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-4">
                      <span
                        className={cn(
                          "text-sm font-medium tracking-tight uppercase px-2.5 py-1 rounded-sm",
                          plan.highlighted
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground border border-border",
                        )}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold tracking-tighter text-foreground">
                        {plan.name}
                      </h3>
                    </div>

                    <p className="text-xs text-muted-foreground -mt-2">
                      {plan.tagline} — {plan.description}
                    </p>

                    <div className="flex items-baseline gap-2">
                      {oldPrice > 0 && (
                        <span className="text-base font-medium line-through text-muted-foreground">
                          ${oldPrice}
                        </span>
                      )}
                      <div className="flex items-center gap-1">
                        <span className="text-4xl font-semibold text-foreground">
                          ${price}
                        </span>
                      </div>
                    </div>
                    {price > 0 ? (
                      <p className="text-xs text-muted-foreground -mt-2">
                        Billed today: ${isYearly ? price * 12 : price}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground -mt-2">
                        No credit card required
                      </p>
                    )}

                    <Button
                      className="w-full font-semibold"
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

                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground w-fit">
                      <Video className="w-3.5 h-3.5" />
                      {isYearly
                        ? (plan.videosPerMonth * 12).toLocaleString()
                        : plan.videosPerMonth}{" "}
                      videos / {isYearly ? "year" : "month"}
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">
                        Get access to
                      </p>
                      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground w-fit">
                        <Clapperboard className="w-3.5 h-3.5 text-primary" />
                        AI Shorts
                      </div>
                    </div>

                    <div className="border-t border-border" />

                    <div className="flex-grow">
                      <p className="text-xs font-semibold text-foreground mb-2.5">
                        {plan.key === "pro"
                          ? "Everything in Basic, and also:"
                          : "What's included:"}
                      </p>
                      <ul className="space-y-2">
                        {plan.key === "pro" ? (
                          <>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {credits.toLocaleString()} Credits /{" "}
                              {isYearly ? "year" : "month"}
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Video className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {isYearly ? "1,200" : "100"} videos /{" "}
                              {isYearly ? "year" : "month"}
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <User className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              Custom avatar and background media upload
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Hourglass className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              Faster Rendering Queue
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <ArrowUpCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              High resolution Output
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Headset className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              Priority Support
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Video className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {isYearly
                                ? (plan.videosPerMonth * 12).toLocaleString()
                                : plan.videosPerMonth}{" "}
                              videos / {isYearly ? "year" : "month"}
                            </li>
                            <li className="flex items-center gap-2 text-xs text-foreground">
                              <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              {credits.toLocaleString()} Credits /{" "}
                              {isYearly ? "year" : "month"}
                            </li>
                            {FEATURES.map((f) => (
                              <li
                                key={f.label}
                                className="flex items-center gap-2 text-xs text-foreground"
                              >
                                <f.icon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                {f.label}
                              </li>
                            ))}
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="mt-auto pt-5 text-center">
                      <p className="text-[10px] text-muted-foreground">
                        Cancel at anytime.
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
