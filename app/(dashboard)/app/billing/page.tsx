"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Zap,
  Crown,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  Video,
  Clock,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type PlanKey = "BASIC_MONTHLY" | "BASIC_YEARLY" | "PRO_MONTHLY" | "PRO_YEARLY";

interface Plan {
  key: PlanKey;
  name: string;
  icon: React.ReactNode;
  monthlyPrice: number;
  yearlyPrice: number;
  credits: number;
  yearlyCredits: number;
  shorts: number;
  features: string[];
  highlight: boolean;
}

const PLANS: Plan[] = [
  {
    key: "BASIC_MONTHLY",
    name: "Basic",
    icon: <Zap className="size-5" />,
    monthlyPrice: 19,
    yearlyPrice: 190,
    credits: 150,
    yearlyCredits: 1800,
    shorts: 30,
    features: [
      "30 Shorts per month",
      "150 credits / month",
      "All video styles",
      "HD exports",
      "Email support",
    ],
    highlight: false,
  },
  {
    key: "PRO_MONTHLY",
    name: "Pro",
    icon: <Crown className="size-5" />,
    monthlyPrice: 67,
    yearlyPrice: 670,
    credits: 500,
    yearlyCredits: 6000,
    shorts: 100,
    features: [
      "100 Shorts per month",
      "500 credits / month",
      "All video styles",
      "4K exports",
      "Priority support",
      "Custom voices",
      "Advanced captions",
    ],
    highlight: true,
  },
];

export default function BillingTestPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: Plan) => {
    const planKey: PlanKey = isYearly
      ? plan.key === "BASIC_MONTHLY"
        ? "BASIC_YEARLY"
        : "PRO_YEARLY"
      : plan.key;

    setLoadingPlan(planKey);
    setError(null);

    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      // redirect to Polar hosted checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoadingPlan(null);
    }
  };

  const yearlySavingsPercent = Math.round(((19 * 12 - 190) / (19 * 12)) * 100);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12 text-center"
        >
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <Sparkles className="size-3" />
            Billing Test Page
          </Badge>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground">
            Choose your plan
          </h1>
          <p className="text-muted-foreground">
            5 credits per Short · Credits roll over on renewal
          </p>
        </motion.div>

        {/* Billing toggle */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-10 flex items-center justify-center gap-3"
        >
          <Label
            htmlFor="billing-toggle"
            className={
              !isYearly
                ? "text-foreground font-medium"
                : "text-muted-foreground"
            }
          >
            Monthly
          </Label>
          <Switch
            id="billing-toggle"
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <Label
            htmlFor="billing-toggle"
            className={
              isYearly ? "text-foreground font-medium" : "text-muted-foreground"
            }
          >
            Yearly
          </Label>
          <AnimatePresence>
            {isYearly && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -8, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Badge className="bg-primary text-primary-foreground">
                  Save {yearlySavingsPercent}%
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-6"
            >
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => {
            const planKey: PlanKey = isYearly
              ? plan.key === "BASIC_MONTHLY"
                ? "BASIC_YEARLY"
                : "PRO_YEARLY"
              : plan.key;

            const isLoading = loadingPlan === planKey;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const credits = isYearly ? plan.yearlyCredits : plan.credits;
            const effectiveMonthly = isYearly
              ? Math.round(plan.yearlyPrice / 12)
              : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              >
                <Card
                  className={`relative flex h-full flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md ${
                    plan.highlight
                      ? "border-primary shadow-sm"
                      : "border-border"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-primary" />
                  )}

                  <CardHeader className="pb-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div
                        className={`flex size-9 items-center justify-center rounded-lg ${
                          plan.highlight
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        {plan.icon}
                      </div>
                      {plan.highlight && (
                        <Badge variant="secondary" className="text-xs">
                          Most popular
                        </Badge>
                      )}
                    </div>

                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>
                      {plan.shorts} Shorts / {isYearly ? "year" : "month"}
                    </CardDescription>

                    {/* Price */}
                    <div className="pt-2">
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-bold tracking-tight text-foreground">
                          ${isYearly ? effectiveMonthly : price}
                        </span>
                        <span className="mb-1 text-muted-foreground">/ mo</span>
                      </div>
                      <AnimatePresence mode="wait">
                        {isYearly && (
                          <motion.p
                            key="yearly-note"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-1 text-sm text-muted-foreground"
                          >
                            Billed ${price}/year
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Credit info */}
                    <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Video className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          5 credits per Short
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Zap className="size-3.5 text-primary shrink-0" />
                        <span className="font-medium text-foreground">
                          {credits.toLocaleString()} credits{" "}
                          {isYearly ? "upfront" : "/ month"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">
                          Credits roll over on renewal
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Features */}
                    <ul className="space-y-2.5">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm"
                        >
                          <div
                            className={`flex size-4 shrink-0 items-center justify-center rounded-full ${
                              plan.highlight
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary text-secondary-foreground"
                            }`}
                          >
                            <Check className="size-2.5" />
                          </div>
                          <span className="text-muted-foreground">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button
                      className="w-full"
                      variant={plan.highlight ? "default" : "secondary"}
                      size="lg"
                      disabled={!!loadingPlan}
                      onClick={() => handleCheckout(plan)}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Redirecting to checkout...
                        </>
                      ) : (
                        <>
                          Get {plan.name} {isYearly ? "Yearly" : "Monthly"}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Debug info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 rounded-lg border border-dashed border-border bg-muted/30 p-4"
        >
          <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Debug — Plan keys being sent to /api/billing/checkout
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {(
              [
                "BASIC_MONTHLY",
                "BASIC_YEARLY",
                "PRO_MONTHLY",
                "PRO_YEARLY",
              ] as PlanKey[]
            ).map((key) => (
              <div
                key={key}
                className={`rounded px-2 py-1 ${
                  (isYearly ? key.includes("YEARLY") : key.includes("MONTHLY"))
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {key}
                {(isYearly
                  ? key.includes("YEARLY")
                  : key.includes("MONTHLY")) && (
                  <span className="ml-1 opacity-60">← active</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This is a test page. Checkout redirects to Polar sandbox.
        </p>
      </div>
    </div>
  );
}
