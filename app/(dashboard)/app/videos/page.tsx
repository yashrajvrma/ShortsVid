import type { Metadata } from "next";
import AllVideos from "@/components/videos";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const metadata: Metadata = {
  title: "My Videos",
  description: "View and manage all your AI-generated short videos.",
  robots: { index: false, follow: false },
};


export default async function Videos() {
  prefetch(trpc.videos.getAllShorts.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <AllVideos />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
