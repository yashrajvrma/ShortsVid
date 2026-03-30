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
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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

export function PricingModal() {
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
    /* ── Backdrop ── */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-4xl px-4 h-screen">
      {/* ── Modal container ── */}
      <div className="w-full max-w-4xl max-h-[95vh] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-card border-border px-6 py-8 flex flex-col items-center gap-1 text-center rounded-2xl">
          {/* <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 border border-primary/20 mb-1">
            <Lock className="size-4 text-primary" />
          </div> */}
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Subscribe to unlock more features
          </h2>
          {/* <p className="text-sm text-muted-foreground max-w-xs">
            You're on the free plan. Pick a plan below to unlock all features.
          </p> */}
        </div>

        {/* ── Plans ── */}
        <div className="p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            {PLANS.map((plan) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const oldPrice = isYearly
                ? plan.yearlyOldPrice
                : plan.monthlyOldPrice;
              const credits = isYearly
                ? plan.yearlyCredits
                : plan.monthlyCredits;

              const isLoading =
                checkoutMutation.isPending &&
                checkoutMutation.variables?.planKey ===
                  getPlanKey(plan.key, period);

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
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-4">
                      <span
                        className={cn(
                          "text-sm font-medium tracking- uppertightcase px-2.5 py-1 rounded-sm",
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
                    {/* Name + toggle */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold tracking-tighter text-foreground">
                        {plan.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase">
                          Yearly
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

                    <p className="text-xs text-muted-foreground -mt-2">
                      {plan.tagline} — {plan.description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-medium line-through text-muted-foreground">
                        ${oldPrice}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-4xl font-semibold text-foreground">
                          ${price}
                        </span>
                        <div className="flex flex-col text-xs text-muted-foreground">
                          <span>USD</span>
                          <span>/ mo</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground -mt-2">
                      Billed today: ${isYearly ? price * 12 : price}
                    </p>

                    {/* CTA */}
                    <Button
                      className="w-full font-semibold"
                      variant={plan.highlighted ? "default" : "outline"}
                      disabled={isLoading}
                      onClick={() => handleSubscribe(plan.key)}
                    >
                      {isYearly ? "Subscribe →" : "Start 3 days Free trial"}
                    </Button>

                    {/* Videos pill */}
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground w-fit">
                      <Video className="w-3.5 h-3.5" />
                      {isYearly
                        ? (plan.videosPerMonth * 12).toLocaleString()
                        : plan.videosPerMonth}{" "}
                      videos / {isYearly ? "year" : "month"}
                    </div>

                    {/* Access */}
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

                    {/* Features */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2.5">
                        What&apos;s included:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2 text-xs text-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {isYearly
                            ? (plan.videosPerMonth * 12).toLocaleString()
                            : plan.videosPerMonth}{" "}
                          videos / {isYearly ? "year" : "month"}
                        </li>
                        <li className="flex items-center gap-2 text-xs text-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          {credits.toLocaleString()} Credits /{" "}
                          {isYearly ? "year" : "month"}
                        </li>
                        {FEATURES.map((f) => (
                          <li
                            key={f.label}
                            className="flex items-center gap-2 text-xs text-foreground"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
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
      </div>
    </div>
  );
}
