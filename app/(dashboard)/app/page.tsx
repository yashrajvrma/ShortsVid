import App from "@/components/app";
import type { Metadata } from "next";
import { auth } from "@/lib/auth/server";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Your ShortsVid dashboard — create and manage your AI generated shorts",
  robots: { index: false, follow: false },
};

export default async function Home() {
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
