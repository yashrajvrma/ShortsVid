import { prisma } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";
import WelcomeEmail from "@/emails/welcome";
import { resend } from "@/lib/resend";
// import { nextCookies } from "better-auth/next";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          void resend.emails
            .send({
              from: env.EMAIL_FROM,
              to: user.email,
              subject: "Welcome to ShortsVid! 🎉",
              react: WelcomeEmail({ name: user.name }),
            })
            .catch((error) => {
              console.error("Failed to send welcome email:", error);
            });
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN"],
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
        type: ["FREE", "BASIC", "PRO"],
        required: true,
        defaultValue: "FREE",
        input: false,
      },
    },
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      scope: ["profile", "email"],
    },
  },

  // plugins: [nextCookies()],
});
