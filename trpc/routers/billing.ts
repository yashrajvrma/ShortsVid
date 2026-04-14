// src/server/routers/billing.ts
import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../init";
import { polar, SUBSCRIPTION_PLAN_CONFIG } from "@/lib/polar";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";

export const billingRouter = createTRPCRouter({
  // createCheckout: authProcedure
  //   .input(
  //     z.object({
  //       planKey: z.enum(
  //         ["BASIC_MONTHLY", "BASIC_YEARLY", "PRO_MONTHLY", "PRO_YEARLY"],
  //         { error: "Invalid plan" },
  //       ),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const config = SUBSCRIPTION_PLAN_CONFIG[input.planKey];
  //     const checkout = await polar.checkouts.create({
  //       products: [config.productId],
  //       successUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/app`,
  //       customerEmail: ctx.email,
  //       metadata: {
  //         userId: ctx.userId,
  //         planKey: input.planKey,
  //       },
  //     });
  //     return { url: checkout.url };
  //   }),
  // cancelSubscription: authProcedure.mutation(async ({ ctx }) => {
  //   const subscription = await prisma.subscription.findUnique({
  //     where: { userId: ctx.userId },
  //   });
  //   if (!subscription || subscription.status === "CANCELLED") {
  //     throw new TRPCError({
  //       code: "NOT_FOUND",
  //       message: "No active subscription found",
  //     });
  //   }
  //   await polar.subscriptions.revoke({
  //     id: subscription.polarSubscriptionId,
  //   });
  //   return {
  //     success: true,
  //   };
  // }),
});
