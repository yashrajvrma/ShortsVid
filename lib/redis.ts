import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});

// Allow 2 requests per 24 hours per IP for unauthenticated script generation
export const freeToolRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "24 h"),
  analytics: true,
});
