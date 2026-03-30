"use client";

import { useState } from "react";
import {
  Check,
  Zap,
  Video,
  Mic,
  Film,
  Gamepad2,
  Captions,
  Clapperboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod"; // or wherever your toast comes from

type Period = "monthly" | "yearly";
type PlanKey = "BASIC_MONTHLY" | "BASIC_YEARLY" | "PRO_MONTHLY" | "PRO_YEARLY";

const FEATURES = [
  { icon: Zap, label: "Optimized for YouTube Shorts" },
  { icon: Film, label: "Instagram Reels & TikTok Compatibility" },
  { icon: Captions, label: "Faceless Shorts, Fake Text, Split Screen" },
  { icon: Mic, label: "10+ languages" },
  { icon: Mic, label: "40+ AI voices" },
  { icon: Film, label: "Story-Driven Short Videos" },
  { icon: Film, label: "Facts-Based Video Shorts" },
  { icon: Gamepad2, label: "Gameplay-Focused Shorts" },
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

// Maps plan.key + period → the planKey enum tRPC expects
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
    highlighted: true,
    badge: "BEST VALUE",
  },
];

export function PricingSection() {
  const trpc = useTRPC();
  const router = useRouter();
  const [period, setPeriod] = useState<Period>("monthly");

  const isYearly = period === "yearly";

  const checkoutMutation = useMutation(
    trpc.billing.createCheckout.mutationOptions({
      onSuccess: ({ url }) => router.push(url),
      onError: (error) => {
        toast.error(error.message || "Failed to create checkout");
      },
    }),
  );

  const handleSubscribe = (planKey: string) => {
    const resolvedPlanKey = getPlanKey(planKey, period);
    checkoutMutation.mutate({ planKey: resolvedPlanKey });
  };

  return (
    <section
      id="pricing"
      className="w-full sm:py-20 py-12 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center sm:mb-24 mb-16">
          <div className="text-4xl sm:text-5xl font-semibold tracking-tighter text-foreground mb-4">
            Pricing
          </div>
          <div className="text-lg mt-5 font-medium">
            Save{" "}
            <span className="text-primary font-semibold tracking-tight">
              40% off
            </span>{" "}
            on yearly plan
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md sm:max-w-full mx-auto">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const oldPrice = isYearly
              ? plan.yearlyOldPrice
              : plan.monthlyOldPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.monthlyCredits;

            // Whether THIS card's button is loading
            const isLoading =
              checkoutMutation.isPending &&
              checkoutMutation.variables?.planKey ===
                getPlanKey(plan.key, period);

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
                  {/* Plan name row — with inline toggle */}
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-3xl font-semibold text-foreground tracking-tighter">
                      {plan.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-muted-foreground">
                        YEARLY
                      </span>
                      <Switch
                        checked={isYearly}
                        onCheckedChange={(v) =>
                          setPeriod(v ? "yearly" : "monthly")
                        }
                        className="data-[state=checked]:bg-primary scale-90"
                      />
                    </div>
                  </div>

                  <p className="text-sm font-medium text-muted-foreground">
                    {plan.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mt-5">
                    <span className="text-xl font-medium line-through text-muted-foreground">
                      ${oldPrice}
                    </span>
                    <div className="flex items-center gap-x-1">
                      <div className="text-5xl font-semibold text-foreground">
                        ${price}
                      </div>
                      <div className="flex flex-col text-sm">
                        <span className="text-muted-foreground">USD</span>
                        <span className="text-muted-foreground">Per Month</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed today: ${isYearly ? price * 12 : price}
                  </p>

                  {/* CTA */}
                  <Button
                    size="lg"
                    className="w-full mt-5 font-medium text-base tracking-tight"
                    variant={plan.highlighted ? "default" : "outline"}
                    disabled={isLoading}
                    onClick={() => handleSubscribe(plan.key)}
                  >
                    {isYearly ? "Subscribe →" : "Start 3 days Free trial"}
                  </Button>

                  {/* Videos per month/year pill */}
                  <div className="mt-5">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground w-fit">
                      <Video className="w-3.5 h-3.5" />
                      {isYearly
                        ? (plan.videosPerMonth * 12).toLocaleString()
                        : plan.videosPerMonth}{" "}
                      Short Videos / {isYearly ? "year" : "month"}
                    </div>
                  </div>

                  {/* Get access to */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">
                      Get access to
                    </p>
                    <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground w-fit">
                      <Clapperboard className="w-3.5 h-3.5 text-primary" />
                      AI Shorts
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-5 border-t border-border" />

                  {/* Features */}
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">
                      What&apos;s included:
                    </p>
                    <ul className="space-y-2.5">
                      <li className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {isYearly
                          ? (plan.videosPerMonth * 12).toLocaleString()
                          : plan.videosPerMonth}{" "}
                        Short Videos per {isYearly ? "year" : "month"}
                      </li>
                      <li className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {credits.toLocaleString()} Credits per{" "}
                        {isYearly ? "Year" : "Month"}
                      </li>
                      {FEATURES.map((f) => (
                        <li
                          key={f.label}
                          className="flex items-center gap-2.5 text-sm text-foreground"
                        >
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          {f.label}
                        </li>
                      ))}
                    </ul>
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
