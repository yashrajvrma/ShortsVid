// src/app/api/webhooks/polar/route.ts
import { NextRequest, NextResponse } from "next/server";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { prisma } from "@/db";
import { getSubscriptionPlanConfigByProductId } from "@/lib/polar";
import {
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionPeriod,
  CreditHistoryType,
} from "@prisma/client";
import { env } from "@/lib/env";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Maps Polar's recurringInterval string to your SubscriptionPeriod enum.
 */
function mapPeriod(recurringInterval: string): SubscriptionPeriod {
  if (recurringInterval === "year") return SubscriptionPeriod.YEARLY;
  if (recurringInterval === "week") return SubscriptionPeriod.WEEKLY;
  return SubscriptionPeriod.MONTHLY;
}

/**
 * Maps Polar's subscription status string to your SubscriptionStatus enum.
 */
function mapStatus(status: string): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELLED;
    case "revoked":
      return SubscriptionStatus.EXPIRED;
    default:
      console.warn(`[Polar Webhook] Unknown subscription status: ${status}`);
      return SubscriptionStatus.ACTIVE;
  }
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: ReturnType<typeof validateEvent>;

  try {
    event = validateEvent(rawBody, headers, env.POLAR_WEBHOOK_SECRET);
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

      case "subscription.updated":
        await handleSubscriptionUpdated(event.data);
        break;

      case "subscription.active":
        await handleSubscriptionActive(event.data);
        break;

      case "subscription.past_due":
        await handleSubscriptionPastDue(event.data);
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

      case "order.paid":
        await handleOrderPaid(event.data);
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

// ─── Handlers ─────────────────────────────────────────────────────────────────

/**
 * subscription.created
 *
 * Fires when the subscription object is first created in Polar.
 * JOB: create the subscription record in DB only.
 * DO NOT add credits or upgrade user.plan here — order.paid handles that.
 */
async function handleSubscriptionCreated(data: any) {
  const userId = data.metadata?.userId as string | undefined;
  if (!userId) {
    console.error(
      "[Polar Webhook] subscription.created — missing userId in metadata",
    );
    return;
  }

  const planConfig = getSubscriptionPlanConfigByProductId(data.productId);
  if (!planConfig) {
    console.error(
      "[Polar Webhook] subscription.created — unknown productId:",
      data.productId,
    );
    return;
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      polarSubscriptionId: data.id,
      polarCustomerId: data.customerId,
      polarProductId: data.productId,
      polarPriceId: data.prices[0]?.id ?? "",
      amount: data.amount,
      currency: data.currency ?? "usd",
      plan: planConfig.plan,
      period: mapPeriod(data.recurringInterval),
      status: mapStatus(data.status),
      startedAt: data.startedAt ?? new Date(),
      endsAt: null, // always null on creation
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
    },
    update: {
      // Handles re-subscribe after expiry — overwrite with new subscription details
      polarSubscriptionId: data.id,
      polarCustomerId: data.customerId,
      polarProductId: data.productId,
      polarPriceId: data.prices[0]?.id ?? "",
      amount: data.amount,
      currency: data.currency ?? "usd",
      plan: planConfig.plan,
      period: mapPeriod(data.recurringInterval),
      status: mapStatus(data.status),
      startedAt: data.startedAt ?? new Date(),
      endsAt: null, // reset on new subscription
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: false,
    },
  });

  console.log(
    `[Polar Webhook] Subscription record created for userId: ${userId}`,
  );
}

/**
 * order.paid
 *
 * Fires when a payment is fully confirmed and settled by Polar.
 * This is the ONLY place where we upgrade user.plan and add credits.
 *
 * Single transaction flow:
 *   1. INSERT credit_history with polarOrderId (@unique) — idempotency guard
 *      If duplicate webhook arrives → unique constraint violation →
 *      entire tx rolls back → user.credit and user.plan never touched ✅
 *   2. UPDATE user.credit += planConfig.credits
 *   3. UPDATE user.plan = planConfig.plan
 */
async function handleOrderPaid(data: any) {
  // const userId = data.metadata?.userId as string | undefined;
  const userId =
    (data.subscription?.metadata?.userId as string | undefined) ??
    (data.metadata?.userId as string | undefined);

  if (!userId) {
    throw new Error(
      `[Polar Webhook] order.paid — userId not found in metadata, orderId: ${data.id}`,
    );
  }

  if (!data.productId) {
    console.warn(
      "[Polar Webhook] order.paid — missing productId in order:",
      data.id,
    );
    return;
  }

  const planConfig = getSubscriptionPlanConfigByProductId(data.productId);
  if (!planConfig) {
    console.error(
      "[Polar Webhook] order.paid — unknown productId:",
      data.productId,
    );
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Fetch current balance for the history log
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { credit: true },
      });

      const balanceBefore = user.credit;
      const balanceAfter = balanceBefore + planConfig.credits;

      // Step 1 — idempotency guard
      // If polarOrderId already exists this throws P2002 → rolls back entire tx
      await tx.creditHistory.create({
        data: {
          userId,
          amount: planConfig.credits,
          description: `${planConfig.label} — ${data.subscriptionId ? "renewal" : "new subscription"}`,
          balanceBefore,
          balanceAfter,
          type: CreditHistoryType.SUBSCRIPTION_CREDIT,
          polarOrderId: data.id,
          polarSubscriptionId: data.subscriptionId ?? null,
        },
      });

      // Step 2 — credit the user
      await tx.user.update({
        where: { id: userId },
        data: { credit: balanceAfter },
      });

      // Step 3 — upgrade the plan
      await tx.user.update({
        where: { id: userId },
        data: { plan: planConfig.plan },
      });
    });

    console.log(
      `[Polar Webhook] order.paid — userId: ${userId}, +${planConfig.credits} credits, orderId: ${data.id}`,
    );
  } catch (err: any) {
    // P2002 = Prisma unique constraint violation
    // polarOrderId already exists → duplicate webhook delivery → safe to ignore
    if (err?.code === "P2002" && err?.meta?.target?.includes("polarOrderId")) {
      console.log(
        `[Polar Webhook] order.paid duplicate ignored — orderId: ${data.id}`,
      );
      return;
    }
    // Anything else is a real error — rethrow so outer handler returns 500
    throw err;
  }
}

/**
 * subscription.updated
 *
 * Fires on almost any change to the subscription object.
 * JOB: sync period dates, status, and pricing fields only.
 * NO credits, NO plan changes — order.paid handles that.
 */
async function handleSubscriptionUpdated(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.updated — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      status: mapStatus(data.status),
      currentPeriodStart: data.currentPeriodStart,
      currentPeriodEnd: data.currentPeriodEnd,
      cancelAtPeriodEnd: data.cancelAtPeriodEnd,
      polarProductId: data.productId,
      polarPriceId: data.prices[0]?.id ?? subscription.polarPriceId,
      amount: data.amount,
      endsAt: data.endsAt ?? null,
    },
  });
}

/**
 * subscription.active
 *
 * Fires when subscription moves to active — e.g. after recovering
 * from past_due once payment retries succeed.
 * JOB: set status to ACTIVE only.
 * Credits for the recovered payment come via the separate order.paid event.
 */
async function handleSubscriptionActive(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.active — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: { status: SubscriptionStatus.ACTIVE },
  });
}

/**
 * subscription.past_due
 *
 * Fires when a payment fails and Polar enters its retry grace period.
 * JOB: set status to PAST_DUE only.
 * DO NOT touch user.plan — user still has access during the grace period.
 */
async function handleSubscriptionPastDue(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.past_due — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: { status: SubscriptionStatus.PAST_DUE },
  });
}

/**
 * subscription.canceled
 *
 * User cancelled — access continues until currentPeriodEnd.
 * JOB: mark cancelAtPeriodEnd = true, status = CANCELLED.
 * DO NOT touch user.plan — subscription.revoked handles the actual downgrade.
 */
async function handleSubscriptionCanceled(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.canceled — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      status: SubscriptionStatus.CANCELLED,
      cancelAtPeriodEnd: true,
    },
  });
}

/**
 * subscription.uncanceled
 *
 * User changed their mind and reactivated before the period ended.
 * JOB: flip back to ACTIVE, clear cancelAtPeriodEnd.
 */
async function handleSubscriptionUncanceled(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.uncanceled — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.subscription.update({
    where: { polarSubscriptionId: data.id },
    data: {
      status: SubscriptionStatus.ACTIVE,
      cancelAtPeriodEnd: false,
    },
  });
}

/**
 * subscription.revoked
 *
 * Period truly ended — either naturally after cancellation or Polar
 * forcefully terminated (repeated payment failures, fraud, etc).
 * JOB: set status = EXPIRED, downgrade user.plan to FREE, record endsAt.
 * Credits are intentionally kept — user can still spend remaining balance.
 */
async function handleSubscriptionRevoked(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { polarSubscriptionId: data.id },
  });

  if (!subscription) {
    console.warn(
      `[Polar Webhook] subscription.revoked — no record found for: ${data.id}`,
    );
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.subscription.update({
      where: { polarSubscriptionId: data.id },
      data: {
        status: SubscriptionStatus.EXPIRED,
        endsAt:
          data.endedAt ?? data.endsAt ?? data.currentPeriodEnd ?? new Date(),
      },
    });

    await tx.user.update({
      where: { id: subscription.userId },
      data: { plan: SubscriptionPlan.FREE },
    });
  });

  console.log(
    `[Polar Webhook] Subscription revoked — userId: ${subscription.userId} downgraded to FREE`,
  );
}
