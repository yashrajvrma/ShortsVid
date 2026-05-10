import { z } from "zod";
import { createTRPCRouter, toolProcedure } from "../init";
import { generateTikTokScript } from "@/lib/openai";
import { prisma } from "@/db";

export const toolRouter = createTRPCRouter({
  generate: toolProcedure
    .input(
      z.object({
        topic: z.enum([
          "MOTIVATIONAL",
          "HORROR_STORY",
          "HISTORY_FACTS",
          "PHILOSOPHY",
          "STORYTELLING",
          "MYSTERY_STORY",
          "LIFE_HACKS",
          "ANY_TOPIC",
        ]),
        duration: z.number().int().min(15).max(180),
        prompt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Middleware has already handled:
      // ✅ Guest IP rate limit — 2 per 24h via Upstash sliding window
      // ✅ Auth credit balance check — fresh DB read, fails before AI call
      // Everything below is pure business logic.

      // ── Generate ───────────────────────────────────────────────────────────
      const scriptParagraphs = await generateTikTokScript(
        input.topic,
        input.duration,
        input.prompt,
      );

      // ── Persist ────────────────────────────────────────────────────────────
      const script = await prisma.script.create({
        data: {
          userId: ctx.user?.id ?? null, // null for guests — matches schema
          topic: input.topic,
          duration: input.duration,
          prompt: input.prompt ?? null,
          content: scriptParagraphs,
        },
      });

      // ── Deduct credit (auth only, after success) ───────────────────────────
      // Always deduct AFTER generation succeeds.
      // Failed generations never cost the user a credit.
      if (ctx.user) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: ctx.user.id },
            data: { credit: { decrement: 1 } },
          }),
          prisma.creditHistory.create({
            data: {
              userId: ctx.user.id,
              amount: -1,
              description: "Generated TikTok Script",
              balanceBefore: ctx.user.credit,
              balanceAfter: ctx.user.credit - 1,
            },
          }),
        ]);
      }

      return {
        success: true,
        scriptId: script.id,
        content: scriptParagraphs,
        remaining: ctx.rateLimit.remaining, // number for guests, null for auth
        isGuest: ctx.rateLimit.isGuest, // frontend uses to show sign-in CTA
      };
    }),
});
