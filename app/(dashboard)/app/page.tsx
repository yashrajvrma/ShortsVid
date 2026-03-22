import App from "@/components/app";
import { auth } from "@/lib/auth/server";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
