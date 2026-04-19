import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.string().min(1),

    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),

    OPENAI_API_KEY: z.string().min(1),

    // cloudflare api key
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    R2_BUCKET_NAME: z.string().min(1),

    // fish audio
    FISH_AUDIO_API_KEY: z.string().min(1),

    // together ai
    TOGETHER_AI_API_KEY: z.string().min(1),

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
  },
  experimental__runtimeEnv: {},
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
