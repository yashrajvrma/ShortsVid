import { prisma } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Dynamically imported so @react-email never enters the auth bundle
          void import("@/actions/email/send-welcome-email")
            .then(({ sendWelcomeEmail }) =>
              sendWelcomeEmail({ name: user.name, email: user.email }),
            )
            .catch((error) => {
              console.error("[auth] Welcome email hook failed:", error);
            });
        },
      },
    },
  },

  // ── Custom user fields ────────────────────────────────────────────────────
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"] as const,
        required: true,
        defaultValue: "USER",
        input: false,
      },
      credit: {
        type: "number",
        required: true,
        defaultValue: 0,
        input: false,
      },
      plan: {
        type: ["FREE", "STARTER", "BASIC", "PRO"] as const,
        required: true,
        defaultValue: "FREE",
        input: false,
      },
    },
  },

  // ── Social providers ──────────────────────────────────────────────────────
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      scope: ["profile", "email"],
    },
  },
});
