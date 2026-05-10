import * as Sentry from "@sentry/node";
import { auth } from "@/lib/auth/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { cache } from "react";
import superjson from "superjson";
import { prisma } from "@/db";
import { freeToolRateLimit } from "@/lib/redis";

// ─────────────────────────────────────────────────────────────────────────────
// Context
// Intentionally empty — headers() must never be called here.
// This runs during SSG build time and would crash next build.
// All auth/ip resolution happens inside middlewares instead,
// which only ever run on real HTTP requests.
// ─────────────────────────────────────────────────────────────────────────────

export const createTRPCContext = cache(async () => {
  return {};
});

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// ─────────────────────────────────────────────────────────────────────────────
// Init
// ─────────────────────────────────────────────────────────────────────────────

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const sentryMiddleware = t.middleware(
  Sentry.trpcMiddleware({ attachRpcInput: true }),
);

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(sentryMiddleware);

// ─────────────────────────────────────────────────────────────────────────────
// Exported context types
// Import in routers for typed ctx without opening init.ts.
// ─────────────────────────────────────────────────────────────────────────────

export type AuthContext = {
  user: NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>["user"];
  ip: string;
};

export type ToolContext = {
  user: AuthContext["user"] | null;
  ip: string;
  rateLimit: {
    isGuest: boolean;
    remaining: number | null; // number for guests, null for auth users
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: optionalAuthMiddleware
//
// Single responsibility: resolve who is making the request.
//   - Reads headers and attempts session lookup (never throws)
//   - Extracts client IP from headers
//   - Attaches ctx.user (User | null) and ctx.ip (string)
//
// headers() is safe inside middlewares — they only run on real HTTP
// requests, never during SSG build time.
// ─────────────────────────────────────────────────────────────────────────────

const optionalAuthMiddleware = t.middleware(async ({ next }) => {
  const reqHeaders = await headers();

  const session = await auth.api
    .getSession({ headers: reqHeaders })
    .catch(() => null);

  const ip =
    reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() ??
    reqHeaders.get("x-real-ip") ??
    "unknown";

  return next({
    ctx: {
      user: session?.user ?? null,
      ip,
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: rateLimitMiddleware
//
// Single responsibility: enforce IP-based rate limits for guest users.
//   - Auth users skipped entirely — credits handle their throttling
//   - All tools share the same limit: 2 requests per 24 hours per IP
//   - Reset time displayed in hours (not minutes)
//   - Attaches ctx.rateLimit { isGuest, remaining }
// ─────────────────────────────────────────────────────────────────────────────

const rateLimitMiddleware = t.middleware(async ({ ctx, next }) => {
  const { user, ip } = ctx as { user: unknown; ip: string };

  if (!user) {
    const { success, remaining, reset } = await freeToolRateLimit.limit(ip);

    if (!success) {
      const resetsInHours = Math.ceil((reset - Date.now()) / 1000 / 60 / 60);
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Free limit reached. Sign in to generate more. Resets in ${resetsInHours} ${resetsInHours === 1 ? "hour" : "hours"}.`,
      });
    }

    return next({
      ctx: {
        ...ctx,
        rateLimit: { isGuest: true, remaining },
      },
    });
  }

  // Auth user — skip rate limit, credit middleware handles them
  return next({
    ctx: {
      ...ctx,
      rateLimit: { isGuest: false, remaining: null },
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware: creditCheckMiddleware
//
// Single responsibility: validate auth user has sufficient credits.
//   - Skipped entirely for guests
//   - Fresh DB read — session credit can be stale across tabs
//   - Fails fast before any expensive AI/generation call
//   - Always costs 1 credit across all tools
//   - Throws FORBIDDEN if balance is insufficient
//
// Exported so it can be reused on any auth route that needs credit
// gating beyond the standard toolProcedure.
// ─────────────────────────────────────────────────────────────────────────────

export const creditCheckMiddleware = t.middleware(async ({ ctx, next }) => {
  const { user } = ctx as { user: { id: string } | null };

  if (!user) {
    // Guest — already handled by rateLimitMiddleware
    return next({ ctx });
  }

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { credit: true },
  });

  if (!freshUser || freshUser.credit < 1) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Insufficient credits. Please upgrade your plan.",
    });
  }

  return next({ ctx });
});

// ─────────────────────────────────────────────────────────────────────────────
// Procedure: authProcedure
//
// For protected dashboard routes.
// Composition: base → optionalAuth → auth guard
// ctx shape: { user: User (non-null), ip: string }
// ─────────────────────────────────────────────────────────────────────────────

export const authProcedure = baseProcedure
  .use(optionalAuthMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Authorization failed",
      });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user, // narrowed — guaranteed non-null for downstream
      },
    });
  });

// ─────────────────────────────────────────────────────────────────────────────
// Procedure: toolProcedure
//
// For public tool routes that serve both guests and auth users.
// Composition: base → optionalAuth → rateLimit → creditCheck
// ctx shape: { user: User | null, ip: string, rateLimit: { isGuest, remaining } }
//
// Fixed config — no factory, no params:
//   Guests     → 2 free requests per 24h per IP, resets shown in hours
//   Auth users → 1 credit per generation, checked fresh from DB
// ─────────────────────────────────────────────────────────────────────────────

export const toolProcedure = baseProcedure
  .use(optionalAuthMiddleware)
  .use(rateLimitMiddleware)
  .use(creditCheckMiddleware);
