// src/app/api/billing/cancel/route.ts
import { NextRequest, NextResponse } from "next/server";
import { polar } from "@/lib/polar";
import { auth } from "@/lib/auth-server";
import { prisma } from "@/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription || subscription.status === "CANCELLED") {
    return NextResponse.json(
      { error: "No active subscription found" },
      { status: 404 },
    );
  }

  // Polar SDK v2 — cancel is done via revoke (cancels at period end)
  await polar.subscriptions.revoke({
    id: subscription.polarSubscriptionId,
  });

  // do NOT update DB here — webhook handles state

  return NextResponse.json({ success: true });
}
