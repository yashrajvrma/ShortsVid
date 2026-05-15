// import { prisma } from "@/db";
// import { betterAuth } from "better-auth";
// import { prismaAdapter } from "better-auth/adapters/prisma";
// import { env } from "@/lib/env";
// import WelcomeEmail from "@/emails/welcome";
// import { resend } from "@/lib/resend";
// // import { nextCookies } from "better-auth/next";

// export const auth = betterAuth({
//   database: prismaAdapter(prisma, {
//     provider: "postgresql",
//   }),
//   databaseHooks: {
//     user: {
//       create: {
//         after: async (user) => {
//           void resend.emails
//             .send({
//               from: env.EMAIL_FROM,
//               to: user.email,
//               subject: "Welcome to ShortsVid! 🎉",
//               react: WelcomeEmail({ name: user.name }),
//             })
//             .catch((error) => {
//               console.error("Failed to send welcome email:", error);
//             });
//         },
//       },
//     },
//   },
//   user: {
//     additionalFields: {
//       role: {
//         type: ["USER", "ADMIN"],
//         required: true,
//         defaultValue: "USER",
//         input: false,
//       },
//       credit: {
//         type: "number",
//         required: true,
//         defaultValue: 0,
//         input: false,
//       },
//       plan: {
//         type: ["FREE", "BASIC", "PRO"],
//         required: true,
//         defaultValue: "FREE",
//         input: false,
//       },
//     },
//   },
//   socialProviders: {
//     google: {
//       clientId: env.GOOGLE_CLIENT_ID as string,
//       clientSecret: env.GOOGLE_CLIENT_SECRET as string,
//       accessType: "offline",
//       scope: ["profile", "email"],
//     },
//   },

//   // plugins: [nextCookies()],
// });

import { prisma } from "@/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "@/lib/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // ── Email & Password (if you ever add it) ────────────────────────────────
  // emailAndPassword: { enabled: true },

  // ── Database hooks ────────────────────────────────────────────────────────
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
        type: ["FREE", "BASIC", "PRO"] as const,
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

  // ── nextCookies plugin ────────────────────────────────────────────────────
  // See explanation below — uncomment if you use server actions that need auth
  // plugins: [nextCookies()],
});
