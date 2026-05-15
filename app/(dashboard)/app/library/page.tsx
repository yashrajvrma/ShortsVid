import type { Metadata } from "next";
import AllVideos from "@/components/videos";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "Videos",
  description: "View and manage all your AI-generated short videos.",
  robots: { index: false, follow: false },
};

export default async function Videos() {
  prefetch(trpc.videos.getAllShorts.queryOptions());
  prefetch(trpc.videos.getAllConversationVideos.queryOptions());

  return (
    <HydrateClient>
      <ErrorBoundary
        fallback={
          <div className="flex items-center min-h-screen justify-center text-base">
            Something went wrong
          </div>
        }
      >
        {/* ✅ Suspense now uses the same Loading skeleton, not plain text */}
        <Suspense fallback={<Loading />}>
          <AllVideos />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
