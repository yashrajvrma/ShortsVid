// import * as Sentry from "@sentry/node";
// import { auth } from "@/lib/auth/server";
// import { initTRPC, TRPCError } from "@trpc/server";
// import { headers } from "next/headers";
// import { cache } from "react";
// import superjson from "superjson";

// export const createTRPCContext = cache(async () => {
//   /**
//    * @see: https://trpc.io/docs/server/context
//    */
//   return {};
// });

// // Avoid exporting the entire t-object
// // since it's not very descriptive.
// // For instance, the use of a t variable
// // is common in i18n libraries.
// const t = initTRPC.create({
//   /**
//    * @see https://trpc.io/docs/server/data-transformers
//    */
//   transformer: superjson,
// });

// const sentryMiddleware = t.middleware(
//   Sentry.trpcMiddleware({
//     attachRpcInput: true,
//   }),
// );

// // Base router and procedure helpers
// export const createTRPCRouter = t.router;
// export const createCallerFactory = t.createCallerFactory;
// export const baseProcedure = t.procedure.use(sentryMiddleware);

// // Authenticated procedure
// export const authProcedure = baseProcedure.use(async ({ next }) => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });

//   if (!session || !session.user) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "Authorization failed",
//     });
//   }
//   // return next middleware with userId in context
//   return next({
//     ctx: {
//       userId: session.user.id,
//       name: session.user.name,
//       email: session.user.email,
//       role: session.user.role,
//       credit: session.user.credit,
//     },
//   });
// });

import * as Sentry from "@sentry/node";
import { auth } from "@/lib/auth/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { prisma } from "@/db";
import { Ratelimit } from "@upstash/ratelimit";

// ── Context ────────────────────────────────────────────────────────────────────
export const createTRPCContext = cache(async () => {
  const reqHeaders = await headers();

  const session = await auth.api
    .getSession({ headers: reqHeaders })
    .catch(() => null);

  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
    reqHeaders.get("x-real-ip") ??
    "unknown";

  return {
    user: session?.user ?? null,
    ip,
  };
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// ── Init ───────────────────────────────────────────────────────────────────────
const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({ attachRpcInput: true }),
);

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);

// ── Auth procedure ─────────────────────────────────────────────────────────────
export const authProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authorization failed",
    });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user, // narrowed — non-null
    },
  });
});

// ── Tool procedure factory ─────────────────────────────────────────────────────
interface ToolProcedureOptions {
  identifier: string;
  rateLimit: Ratelimit; // pass your upstash ratelimit instance
  creditCost?: number;
}

export const createToolProcedure = ({
  rateLimit,
  creditCost = 1,
}: ToolProcedureOptions) =>
  baseProcedure
    // ── Rate limit (guests only) ───────────────────────────────────────────────
    .use(async ({ ctx, next }) => {
      if (!ctx.user) {
        const { success, remaining, reset } = await rateLimit.limit(ctx.ip);

        if (!success) {
          const resetsInMs = reset - Date.now();
          const resetsInMin = Math.ceil(resetsInMs / 1000 / 60);
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: `Free limit reached. Sign in to generate more. Resets in ${resetsInMin} minutes.`,
          });
        }

        return next({
          ctx: {
            ...ctx,
            rateLimit: { isGuest: true, remaining },
          },
        });
      }

      return next({
        ctx: {
          ...ctx,
          rateLimit: { isGuest: false, remaining: null },
        },
      });
    })
    // ── Credit check (auth users only) — fail fast before calling OpenAI ───────
    .use(async ({ ctx, next }) => {
      if (ctx.user) {
        // Fresh DB read — session credit can be stale
        const freshUser = await prisma.user.findUnique({
          where: { id: ctx.user.id },
          select: { credit: true },
        });

        if (!freshUser || freshUser.credit < creditCost) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Insufficient credits. Please upgrade your plan.",
          });
        }
      }

      return next({ ctx });
    });
