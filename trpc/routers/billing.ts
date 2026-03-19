// src/server/routers/billing.ts
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../init";
import { prisma } from "@/db";
import { CREDITS_PER_VIDEO, SUBSCRIPTION_PLAN_CONFIG } from "@/lib/polar";

export const billingRouter = createTRPCRouter({
  // current subscription + plan info
  getSubscription: authProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: ctx.userId },
      select: {
        plan: true,
        credit: true,
        subscription: true,
      },
    });

    return {
      plan: user.plan,
      credits: user.credit,
      creditsPerVideo: CREDITS_PER_VIDEO,
      videosRemaining: Math.floor(user.credit / CREDITS_PER_VIDEO),
      subscription: user.subscription
        ? {
            status: user.subscription.status,
            interval: user.subscription.period,
            cancelAtPeriodEnd: user.subscription.cancelAtPeriodEnd,
            currentPeriodEnd: user.subscription.currentPeriodEnd,
          }
        : null,
    };
  }),

  // credit transaction history
  getCreditHistory: authProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await prisma.creditHistory.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        nextCursor = items.pop()!.id;
      }

      return { items, nextCursor };
    }),

  // available plans for pricing page
  getPlans: authProcedure.query(() => {
    return Object.entries(SUBSCRIPTION_PLAN_CONFIG).map(([key, config]) => ({
      key,
      label: config.label,
      plan: config.plan,
      interval: config.period,
      credits: config.credits,
    }));
  }),
});
