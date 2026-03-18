import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import VideoDetailClient from "@/components/videos/video-details";
import { getVideoDetailsById } from "@/app/actions/faceless-shorts/get-video-detail-by-id";
import { Loader2 } from "lucide-react";
import type { CaptionStyle } from "@/types";

interface VideoDetailPageProps {
  params: Promise<{ videoId: string }>;
}

export default async function VideoDetailPage({
  params,
}: VideoDetailPageProps) {
  const { videoId } = await params;

  if (!videoId) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const video = await getVideoDetailsById({
    videoId,
    userId: session.user.id,
  });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          }
        >
          <VideoDetailClient videoDetail={video} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
