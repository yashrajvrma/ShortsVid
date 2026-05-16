"use server";

import { redirect } from "next/navigation";
import { polar, SUBSCRIPTION_PLAN_CONFIG } from "@/lib/polar";
import { auth } from "@/lib/auth/server"; // adjust to your auth import
import { headers } from "next/headers";
import { env } from "@/lib/env";

type PlanKey = "STARTER_WEEKLY" | "BASIC_MONTHLY" | "BASIC_YEARLY" | "PRO_MONTHLY" | "PRO_YEARLY";

export async function createCheckout(planKey: PlanKey) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    redirect("/login");
  }

  const config = SUBSCRIPTION_PLAN_CONFIG[planKey];

  const checkout = await polar.checkouts.create({
    products: [config.productId],
    successUrl: `${env.NEXT_PUBLIC_BASE_URL}/app`,
    customerEmail: session.user.email!,
    metadata: {
      userId: session.user.id,
      planKey,
    },
  });

  redirect(checkout.url);
}
