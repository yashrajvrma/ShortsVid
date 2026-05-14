// src/lib/credits.ts
import { prisma } from "@/db";
import { CREDITS_PER_VIDEO } from "@/lib/polar";
import { CreditHistoryType } from "@prisma/client";

export class InsufficientCreditsError extends Error {
  constructor(public currentCredits: number) {
    super("Insufficient credits");
    this.name = "InsufficientCreditsError";
  }
}

export async function addCredits({
  userId,
  amount,
  description,
  type,
  polarSubscriptionId,
  polarOrderId,
  videoId, // ← add this
}: {
  userId: string;
  amount: number;
  description?: string;
  type: CreditHistoryType;
  polarSubscriptionId?: string;
  polarOrderId?: string;
  videoId?: string; // ← add this
}) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { credit: true },
    });

    const newBalance = user.credit + amount;

    await tx.user.update({
      where: { id: userId },
      data: { credit: newBalance },
    });

    await tx.creditHistory.create({
      data: {
        userId,
        amount,
        description,
        balanceBefore: user.credit,
        balanceAfter: newBalance,
        type,
        polarSubscriptionId,
        polarOrderId,
        videoId, // ← add this
      },
    });

    return newBalance;
  });
}

export async function deductVideoCredits(userId: string, videoId: string) {
  return await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { credit: true },
    });

    if (user.credit < CREDITS_PER_VIDEO) {
      throw new InsufficientCreditsError(user.credit);
    }

    const newBalance = user.credit - CREDITS_PER_VIDEO;

    await tx.user.update({
      where: { id: userId },
      data: { credit: newBalance },
    });

    await tx.creditHistory.create({
      data: {
        userId,
        amount: -CREDITS_PER_VIDEO,
        description: "Video generation",
        balanceBefore: user.credit,
        balanceAfter: newBalance,
        videoId,
      },
    });

    return newBalance;
  });
}
