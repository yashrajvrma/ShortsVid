"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";

type Period = "monthly" | "yearly";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  key: string;
  name: string;
  icon: React.ElementType;
  monthlyProductId: string;
  yearlyProductId: string;
  monthlyPrice: number;
  yearlyPrice: number; // per month equiv
  yearlyTotal: number;
  monthlyCredits: number;
  yearlyCredits: number;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
  cta: string;
}

const PLANS: Plan[] = [
  {
    key: "basic",
    name: "Basic",
    icon: Zap,
    monthlyProductId: process.env.NEXT_PUBLIC_POLAR_BASIC_MONTHLY_PRODUCT_ID!,
    yearlyProductId: process.env.NEXT_PUBLIC_POLAR_BASIC_YEARLY_PRODUCT_ID!,
    monthlyPrice: 19,
    yearlyPrice: 15, // billed annually
    yearlyTotal: 180,
    monthlyCredits: 150,
    yearlyCredits: 1800,
    description: "Perfect for individual creators just getting started.",
    features: [
      { text: "150 credits / month", included: true },
      { text: "AI Script Generation", included: true },
      { text: "50+ AI Voices", included: true },
      { text: "10 Video Themes", included: true },
      { text: "720p Export", included: true },
      { text: "Watermark on export", included: true },
      { text: "Priority rendering", included: false },
      { text: "Custom branding", included: false },
      { text: "Direct social publish", included: false },
    ],
    cta: "Get Basic Plan",
  },
  {
    key: "pro",
    name: "Pro",
    icon: Crown,
    monthlyProductId: process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY_PRODUCT_ID!,
    yearlyProductId: process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY_PRODUCT_ID!,
    monthlyPrice: 49,
    yearlyPrice: 39,
    yearlyTotal: 468,
    monthlyCredits: 500,
    yearlyCredits: 6000,
    description: "For serious creators scaling their short-form content.",
    features: [
      { text: "500 credits / month", included: true },
      { text: "AI Script Generation", included: true },
      { text: "50+ AI Voices", included: true },
      { text: "All Video Themes", included: true },
      { text: "1080p Export", included: true },
      { text: "No watermark", included: true },
      { text: "Priority rendering", included: true },
      { text: "Custom branding", included: true },
      { text: "Direct social publish", included: true },
    ],
    cta: "Get Pro Plan",
    highlighted: true,
  },
];

export function PricingSection() {
  const [period, setPeriod] = useState<Period>("monthly");
  const router = useRouter();

  const handleCheckout = async (productId: string) => {
    try {
      const response = await axios.post("/api/create-checkout-session", {
        productId,
      });
      if (response.data?.checkoutUrl) {
        router.push(response.data.checkoutUrl);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  const savings = (plan: Plan) =>
    Math.round(
      ((plan.monthlyPrice - plan.yearlyPrice) / plan.monthlyPrice) * 100,
    );

  return (
    <section
      id="pricing"
      className="w-full py-24 px-4 sm:px-6 lg:px-8 bg-background border-t"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 text-primary"
          >
            <Gift className="w-3.5 h-3.5 mr-2" />
            Simple pricing
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground text-balance max-w-2xl mx-auto mb-4">
            Grow your shorts channel faster, for less
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10">
            Start free, scale when ready. No hidden fees, cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-muted/60 rounded-full px-6 py-3 border border-border/60">
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium cursor-pointer transition-colors",
                period === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </Label>
            <Switch
              id="billing-toggle"
              checked={period === "yearly"}
              onCheckedChange={(v) => setPeriod(v ? "yearly" : "monthly")}
              className="data-[state=checked]:bg-primary"
            />
            <Label
              htmlFor="billing-toggle"
              className={cn(
                "text-sm font-medium cursor-pointer transition-colors flex items-center gap-2",
                period === "yearly"
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              Yearly
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </Label>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {PLANS.map((plan, i) => {
            const Icon = plan.icon;
            const productId =
              period === "monthly"
                ? plan.monthlyProductId
                : plan.yearlyProductId;
            const price =
              period === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const credits =
              period === "monthly" ? plan.monthlyCredits : plan.yearlyCredits;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className={cn(plan.highlighted ? "sm:-mt-3" : "")}
              >
                <Card
                  className={cn(
                    "relative flex flex-col overflow-hidden transition-all duration-300 h-full",
                    plan.highlighted
                      ? "border-primary shadow-xl shadow-primary/10 bg-primary/[0.03]"
                      : "border-border hover:border-primary/40 hover:shadow-md",
                  )}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}

                  {plan.highlighted && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="p-8 flex flex-col flex-1">
                    {/* Plan header */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            plan.highlighted ? "bg-primary/10" : "bg-muted",
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5",
                              plan.highlighted
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {plan.name}
                        </h3>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${plan.key}-${period}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-baseline gap-2 mb-2"
                        >
                          <span className="text-5xl font-black text-foreground">
                            ${price}
                          </span>
                          <div className="text-muted-foreground">
                            <div className="text-sm font-medium">/month</div>
                            {period === "yearly" && (
                              <div className="text-xs text-emerald-600 font-semibold">
                                Save {savings(plan)}%
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </AnimatePresence>

                      {period === "yearly" && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Billed{" "}
                          <span className="font-semibold text-foreground">
                            ${plan.yearlyTotal}/year
                          </span>
                        </p>
                      )}

                      <p className="text-sm text-muted-foreground">
                        {plan.description}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-1.5 bg-muted/80 rounded-full px-3 py-1 text-xs font-semibold text-foreground">
                        <Zap className="w-3 h-3 text-primary" />
                        {credits.toLocaleString()} credits{" "}
                        {period === "yearly" ? "(credited upfront)" : "/ month"}
                      </div>
                    </div>

                    {/* CTA */}
                    <Button
                      className={cn(
                        "w-full mb-8 h-11 font-semibold text-sm",
                        plan.highlighted ? "shadow-lg shadow-primary/20" : "",
                      )}
                      variant={plan.highlighted ? "default" : "outline"}
                      onClick={() => handleCheckout(productId)}
                    >
                      {plan.cta}
                    </Button>

                    {/* Features */}
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature.text}
                          className={cn(
                            "flex items-center gap-3 text-sm",
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/50",
                          )}
                        >
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Check className="w-3 h-3 text-primary" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <div className="w-2.5 h-0.5 bg-muted-foreground/30 rounded-full" />
                            </div>
                          )}
                          <span
                            className={feature.included ? "" : "line-through"}
                          >
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All plans include a{" "}
          <span className="font-semibold text-foreground">
            7-day free trial
          </span>
          . No credit card required to start.
        </motion.p>
      </div>
    </section>
  );
}
