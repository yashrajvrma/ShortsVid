import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),

    // Better auth
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    // Google oauth
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),

    // models
    OPENAI_API_KEY: z.string().min(1),
    FISH_AUDIO_API_KEY: z.string().min(1),
    TOGETHER_AI_API_KEY: z.string().min(1),

    // cloudflare api key
    R2_TOKEN: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),
    R2_S3_CLIENT_URL: z.string().min(1),

    // remotion
    REMOTION_GCP_PRIVATE_KEY: z.string().min(1),
    REMOTION_GCP_PROJECT_ID: z.string().min(1),
    GCP_SERVE_URL: z.string().min(1),
    GCP_SITE: z.string().min(1),

    // remotion aws lambda
    REMOTION_AWS_REGION: z.string().min(1),
    REMOTION_AWS_ACCESS_KEY_ID: z.string().min(1),
    REMOTION_AWS_SECRET_ACCESS_KEY: z.string().min(1),
    REMOTION_AWS_SITE: z.string().min(1),
    REMOTION_AWS_SERVE_URL: z.string().min(1),

    // polar
    POLAR_SERVER_ENVIRONMENT: z
      .enum(["sandbox", "production"])
      .default("sandbox"),
    POLAR_BASIC_MONTHLY_PRODUCT_ID: z.string().min(1),
    POLAR_BASIC_YEARLY_PRODUCT_ID: z.string().min(1),
    POLAR_PRO_MONTHLY_PRODUCT_ID: z.string().min(1),
    POLAR_PRO_YEARLY_PRODUCT_ID: z.string().min(1),
    POLAR_ACCESS_TOKEN: z.string().min(1),
    POLAR_WEBHOOK_SECRET: z.string().min(1),

    // sentry
    SENTRY_AUTH_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1),
    NEXT_PUBLIC_SENTRY_ENABLED: z.enum(["TRUE", "FALSE"]).default("FALSE"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_SENTRY_ENABLED: process.env.NEXT_PUBLIC_SENTRY_ENABLED,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
