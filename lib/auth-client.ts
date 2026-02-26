import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_PRODUCTION_BASE_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_BASE_URL,
});

export const { signIn, signOut, signUp, useSession } = authClient;
