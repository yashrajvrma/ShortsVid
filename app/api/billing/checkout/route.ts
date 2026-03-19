// src/app/api/billing/checkout/route.ts
import { auth } from "@/lib/auth-server";
import { polar, SUBSCRIPTION_PLAN_CONFIG } from "@/lib/polar";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  planKey: z.enum([
    "BASIC_MONTHLY",
    "BASIC_YEARLY",
    "PRO_MONTHLY",
    "PRO_YEARLY",
  ]),
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = schema.safeParse(await req.json());
  if (!body.success) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const config = SUBSCRIPTION_PLAN_CONFIG[body.data.planKey];

  const checkout = await polar.checkouts.create({
    products: [config.productId], // ← fix: array not productId
    successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/app`,
    customerEmail: session.user.email,
    metadata: {
      userId: session.user.id,
      planKey: body.data.planKey,
    },
  });

  return NextResponse.json({ url: checkout.url });
}
