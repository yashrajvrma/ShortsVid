// src/app/api/webhooks/polar/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { prisma } from "@/db";
import { getSubscriptionPlanConfigByProductId } from "@/lib/polar";
import { SubscriptionPlan, SubscriptionStatus } from "@prisma/client";
import { addCredits } from "@/lib/credit";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: ReturnType<typeof validateEvent>;

  try {
    event = validateEvent(rawBody, headers, process.env.POLAR_WEBHOOK_SECRET!);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      console.error("[Polar Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  console.log(`[Polar Webhook] Received: ${event.type}`);

  try {
    switch (event.type) {
      case "subscription.created":
        await handleSubscriptionCreated(event.data);
        break;
      case "subscription.active":
        await handleSubscriptionActive(event.data);
        break;
      case "subscription.updated":
        await handleSubscriptionUpdated(event.data);
        break;
      case "subscription.canceled":
        await handleSubscriptionCanceled(event.data);
        break;
      case "subscription.uncanceled":
        await handleSubscriptionUncanceled(event.data);
        break;
      case "subscription.revoked":
        await handleSubscriptionRevoked(event.data);
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`[Polar Webhook] Handler error for ${event.type}:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

// ─── handlers ────────────────────────────────────────────────────────────────

async function handleSubscriptionCreated(data: any) {
  const userId = data.metadata?.userId as string;
  if (!userId) {
    console.error(
      "[Polar Webhook] subscription.created — missing userId in metadata",
    );
    return;
  }
  console.log("inside created");
  console.log("product id", data.productId);

  const planConfig = getSubscriptionPlanConfigByProductId(data.productId);
  if (!planConfig) {
    console.error("[Polar Webhook] Unknown productId:", data.productId);
    return;
  }

  // map Polar status → your enum
  const status =
    data.status === "trialing"
      ? SubscriptionStatus.TRIALING
      : SubscriptionStatus.ACTIVE;

  console.log("status is", status);

  await prisma.$transaction(async (tx) => {
    await tx.subscription.upsert({
      where: { userId },
      create: {
        userId,
        polarSubscriptionId: data.id,
        polarCustomerId: data.customerId,
        plan: planConfig.plan,
        period: planConfig.period,
        status,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd: new Date(data.currentPeriodEnd),
        cancelAtPeriodEnd: false,
      },
      update: {
        polarSubscriptionId: data.id,
        polarCustomerId: data.customerId,
        plan: planConfig.plan,
        period: planConfig.period,
        status,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd: new Date(data.currentPeriodEnd),
        cancelAtPeriodEnd: false,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { plan: planConfig.plan },
    });
  });

  // credit immediately — trial or paid, user can start generating right away
  await addCredits({
    userId,
    amount: planConfig.credits,
    description: `${planConfig.label} — ${status === SubscriptionStatus.TRIALING ? "trial started" : "subscription started"}`,
    polarSubscriptionId: data.id,
  });

  console.log("added credits");
}

async function handleSubscriptionActive(data: any) {
  // fires when past_due resolves back to active — sync status only
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });
  if (!subscription) return;

  console.log("inside subsc active");

  console.log("subs is", subscription);

  console.log("status is", data.status);

  if (data.status !== "active") return;

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: { status: SubscriptionStatus.ACTIVE },
  });
}

async function handleSubscriptionUpdated(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });
  if (!subscription) return;

  // ── trial → active conversion ──────────────────────────────────────────────
  // period dates update here too — trial window vs first real billing period
  const isTrialConversion =
    subscription.status === SubscriptionStatus.TRIALING &&
    data.status === "active";

  console.log("inside subsc updated");

  console.log("is trial", isTrialConversion);

  if (isTrialConversion) {
    await prisma.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(data.currentPeriodStart), // real billing period starts
        currentPeriodEnd: new Date(data.currentPeriodEnd), // real billing period ends
      },
    });
    // no credits added — already credited at trial start
    return;
  }

  // ── renewal — period start moved forward ───────────────────────────────────
  const isRenewal =
    data.status === "active" &&
    !data.cancelAtPeriodEnd &&
    new Date(data.currentPeriodStart).getTime() >
      subscription.currentPeriodStart.getTime();

  if (isRenewal) {
    const planConfig = getSubscriptionPlanConfigByProductId(data.productId);
    if (!planConfig) return;

    await prisma.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: {
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd: new Date(data.currentPeriodEnd),
        cancelAtPeriodEnd: false,
      },
    });

    // rollover is implicit — credits added on top of existing balance
    await addCredits({
      userId: subscription.userId,
      amount: planConfig.credits,
      description: `${planConfig.label} — renewed`,
      polarSubscriptionId: data.id,
    });

    return;
  }

  // ── past due ───────────────────────────────────────────────────────────────
  if (data.status === "past_due") {
    await prisma.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: { status: SubscriptionStatus.PAST_DUE },
    });
    return;
  }

  // ── generic date sync fallback ─────────────────────────────────────────────
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      currentPeriodStart: new Date(data.currentPeriodStart),
      currentPeriodEnd: new Date(data.currentPeriodEnd),
    },
  });
}

async function handleSubscriptionCanceled(data: any) {
  // user cancelled — access continues till period end, plan stays unchanged
  console.log("[Polar Webhook] Subscription cancelled:", data.id);
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      cancelAtPeriodEnd: true,
      status: SubscriptionStatus.CANCELLED,
    },
  });
}

async function handleSubscriptionUncanceled(data: any) {
  // user reactivated before period end
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      cancelAtPeriodEnd: false,
      status: SubscriptionStatus.ACTIVE,
    },
  });
}

async function handleSubscriptionRevoked(data: any) {
  // period truly ended — downgrade to free, keep remaining credits
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });
  if (!subscription) return;

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: { status: SubscriptionStatus.CANCELLED },
    });

    await tx.user.update({
      where: { id: subscription.userId },
      data: {
        plan: SubscriptionPlan.FREE,
        // credits kept intentionally
      },
    });
  });
}
