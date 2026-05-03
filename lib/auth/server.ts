import { prisma } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";
// import { nextCookies } from "better-auth/next";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
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
        defaultValue: 5,
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
