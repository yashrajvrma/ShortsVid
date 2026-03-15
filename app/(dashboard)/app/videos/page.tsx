import AllVideos from "@/components/videos/all-videos";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

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
