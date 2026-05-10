// import { z } from "zod";
// import { baseProcedure, createTRPCRouter } from "../init";
// import { TRPCError } from "@trpc/server";
// import { headers } from "next/headers";
// import { auth } from "@/lib/auth/server";
// import { generateTikTokScript } from "@/lib/openai";
// import { prisma } from "@/db";

// export const scriptRouter = createTRPCRouter({
//   generate: baseProcedure
//     .input(
//       z.object({
//         topic: z.enum([
//           "MOTIVATIONAL",
//           "HORROR_STORY",
//           "HISTORY_FACTS",
//           "PHILOSOPHY",
//           "STORYTELLING",
//           "MYSTERY_STORY",
//           "LIFE_HACKS",
//           "ANY_TOPIC",
//         ]),
//         duration: z.number().int().min(15).max(180),
//         prompt: z.string().optional(),
//       }),
//     )
//     .mutation(async ({ input }) => {
//       // 1. Check Authentication
//       const reqHeaders = await headers();
//       const session = await auth.api.getSession({
//         headers: reqHeaders,
//       });

//       const user = session?.user;

//       if (!user) {
//         // 2. Unauthenticated: Rate limit by IP
//         const ip =
//           reqHeaders.get("x-forwarded-for") ||
//           reqHeaders.get("x-real-ip") ||
//           "unknown";

//         const { success } = await scriptRateLimit.limit(ip);
//         if (!success) {
//           throw new TRPCError({
//             code: "TOO_MANY_REQUESTS",
//             message:
//               "You have used your 2 free scripts. Please sign in to generate more.",
//           });
//         }
//       } else {
//         // 3. Authenticated: Check Credits
//         if (user.credit < 1) {
//           throw new TRPCError({
//             code: "PAYMENT_REQUIRED",
//             message: "Insufficient credits. Please upgrade your plan.",
//           });
//         }
//       }

//       // 4. Generate the script via OpenAI
//       const scriptParagraphs = await generateTikTokScript(
//         input.topic,
//         input.duration,
//         input.prompt,
//       );

//       // 5. Save the generated script to the DB
//       const script = await prisma.script.create({
//         data: {
//           userId: user?.id || null, // null if unauthenticated
//           topic: input.topic,
//           duration: input.duration,
//           prompt: input.prompt || null,
//           content: scriptParagraphs,
//         },
//       });

//       // 6. Deduct 1 credit if authenticated
//       if (user) {
//         await prisma.user.update({
//           where: { id: user.id },
//           data: { credit: { decrement: 1 } },
//         });

//         await prisma.creditHistory.create({
//           data: {
//             userId: user.id,
//             amount: -1,
//             description: "Generated TikTok Script",
//             balanceBefore: user.credit,
//             balanceAfter: user.credit - 1,
//           },
//         });
//       }

//       return {
//         success: true,
//         scriptId: script.id,
//         content: scriptParagraphs,
//       };
//     }),
// });

import { z } from "zod";
import { createTRPCRouter, createToolProcedure } from "../init";
import { generateTikTokScript } from "@/lib/openai";
import { scriptRateLimit } from "@/lib/redis";
import { prisma } from "@/db";

const scriptToolProcedure = createToolProcedure({
  identifier: "tiktok-script-gen",
  rateLimit: scriptRateLimit, // your existing Upstash instance
  creditCost: 1,
});

export const toolRouter = createTRPCRouter({
  generate: scriptToolProcedure
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
      // ── Generate ─────────────────────────────────────────────────────────────
      // Middleware already handled:
      // ✅ Guest rate limit via Upstash
      // ✅ Auth credit balance check (fail fast)
      // Everything below is pure business logic

      const scriptParagraphs = await generateTikTokScript(
        input.topic,
        input.duration,
        input.prompt,
      );

      // ── Save script ───────────────────────────────────────────────────────────
      const script = await prisma.script.create({
        data: {
          userId: ctx.user?.id ?? null,
          topic: input.topic,
          duration: input.duration,
          prompt: input.prompt ?? null,
          content: scriptParagraphs,
        },
      });

      // ── Deduct credit (auth only, after successful generation) ────────────────
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
        remaining: ctx.rateLimit.remaining, // null for auth, number for guest
        isGuest: ctx.rateLimit.isGuest,
      };
    }),
});
