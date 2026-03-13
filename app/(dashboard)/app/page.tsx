import AllVideos from "@/components/dashboard/all-videos";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Dashboard() {
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
