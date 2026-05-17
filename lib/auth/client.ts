import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";
import { auth } from "@/lib/auth/server";

const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(), // access aditional fields in client session
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
