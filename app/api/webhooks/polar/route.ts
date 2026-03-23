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

  // collect ALL headers as a plain object — SDK needs the full headers record
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: ReturnType<typeof validateEvent>;

  try {
    event = validateEvent(
      rawBody,
      headers, // ← pass full headers object, not just signature string
      process.env.POLAR_WEBHOOK_SECRET!,
    );
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
        // fires when subscription moves to active state (e.g. after past_due resolves)
        await handleSubscriptionActive(event.data);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data);
        break;

      case "subscription.canceled":
        // user cancelled — still has access till period end
        await handleSubscriptionCanceled(event.data);
        break;

      case "subscription.uncanceled":
        // user reactivated before period end
        await handleSubscriptionUncanceled(event.data);
        break;

      case "subscription.revoked":
        // period ended — truly over, downgrade to free
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

  const planConfig = getSubscriptionPlanConfigByProductId(data.productId);
  if (!planConfig) {
    console.error("[Polar Webhook] Unknown productId:", data.productId);
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.subscription.upsert({
      where: { userId },
      create: {
        userId,
        polarSubscriptionId: data.id,
        polarCustomerId: data.customerId,
        plan: planConfig.plan,
        period: planConfig.period,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodStart: new Date(data.currentPeriodStart),
        currentPeriodEnd: new Date(data.currentPeriodEnd),
        cancelAtPeriodEnd: false,
      },
      update: {
        polarSubscriptionId: data.id,
        polarCustomerId: data.customerId,
        plan: planConfig.plan,
        period: planConfig.period,
        status: SubscriptionStatus.ACTIVE,
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

  await addCredits({
    userId,
    amount: planConfig.credits,
    description: `${planConfig.label} — subscription started`,
    polarSubscriptionId: data.id,
  });
}

async function handleSubscriptionActive(data: any) {
  // fires when past_due resolves back to active — just sync the status
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });
  if (!subscription) return;

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

  // detect renewal: period start moved forward compared to what we have stored
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

    // rollover is implicit — we add on top of existing credits
    await addCredits({
      userId: subscription.userId,
      amount: planConfig.credits,
      description: `${planConfig.label} — renewed`,
      polarSubscriptionId: data.id,
    });

    return;
  }

  if (data.status === "past_due") {
    await prisma.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: { status: SubscriptionStatus.PAST_DUE },
    });
    return;
  }

  // generic period sync
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      currentPeriodStart: new Date(data.currentPeriodStart),
      currentPeriodEnd: new Date(data.currentPeriodEnd),
    },
  });
}

async function handleSubscriptionCanceled(data: any) {
  // day 25 — user cancelled, access continues till period end
  // do NOT touch user.plan here
  console.log("cancelling subs");
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      cancelAtPeriodEnd: true,
      status: SubscriptionStatus.CANCELLED,
    },
  });
}

async function handleSubscriptionUncanceled(data: any) {
  // user changed their mind and reactivated before period end
  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      cancelAtPeriodEnd: false,
      status: SubscriptionStatus.ACTIVE,
    },
  });
}

async function handleSubscriptionRevoked(data: any) {
  // day 30 — period truly ended, downgrade to free now
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
        // credits kept intentionally — user can still use remaining credits
      },
    });
  });
}
