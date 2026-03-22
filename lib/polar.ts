// src/lib/polar.ts
import { Polar } from "@polar-sh/sdk";
import { SubscriptionPeriod, SubscriptionPlan } from "@prisma/client";
import { env } from "@/lib/env";

export const polar = new Polar({
  // TODO : add all env in env.ts file
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: "sandbox", // use "sandbox" for testing
});

export const CREDITS_PER_VIDEO = 5;

export const SUBSCRIPTION_PLAN_CONFIG = {
  BASIC_MONTHLY: {
    productId: process.env.NEXT_PUBLIC_POLAR_BASIC_MONTHLY_PRODUCT_ID!,
    plan: SubscriptionPlan.BASIC,
    period: SubscriptionPeriod.MONTHLY,
    credits: 150,
    label: "Basic Monthly",
  },
  BASIC_YEARLY: {
    productId: process.env.NEXT_PUBLIC_POLAR_BASIC_YEARLY_PRODUCT_ID!,
    plan: SubscriptionPlan.BASIC,
    period: SubscriptionPeriod.YEARLY,
    credits: 1800, // 150 × 12 — credited upfront
    label: "Basic Yearly",
  },
  PRO_MONTHLY: {
    productId: process.env.NEXT_PUBLIC_POLAR_PRO_MONTHLY_PRODUCT_ID!,
    plan: SubscriptionPlan.PRO,
    period: SubscriptionPeriod.MONTHLY,
    credits: 500,
    label: "Pro Monthly",
  },
  PRO_YEARLY: {
    productId: process.env.NEXT_PUBLIC_POLAR_PRO_YEARLY_PRODUCT_ID!,
    plan: SubscriptionPlan.PRO,
    period: SubscriptionPeriod.YEARLY,
    credits: 6000, // 500 × 12 — credited upfront
    label: "Pro Yearly",
  },
} as const;

export type SubscriptionPlanKey = keyof typeof SUBSCRIPTION_PLAN_CONFIG;

// reverse lookup: productId → plan config
export function getSubscriptionPlanConfigByProductId(productId: string) {
  const entry = Object.entries(SUBSCRIPTION_PLAN_CONFIG).find(
    ([, config]) => config.productId === productId,
  );
  if (!entry) return null;
  return { key: entry[0] as SubscriptionPlanKey, ...entry[1] };
}
