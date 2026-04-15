import type { Metadata } from "next";
import ConversationVideos from "@/components/conversation-videos";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LANGUAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Conversation Videos",
  description:
    "Generate AI-powered conversational videos with two speakers, gameplay backgrounds, captions, and background music.",
  robots: { index: false, follow: false },
};

export default async function ConversationVideosPage() {
  prefetch(trpc.stocks.getAllBackgroundMusic.queryOptions());
  prefetch(trpc.stocks.getBackgroundVideos.queryOptions());
  prefetch(trpc.stocks.getAiAvatars.queryOptions());
  prefetch(
    trpc.voices.getSystemVoice.queryOptions({
      languageCode: LANGUAGES[0].code,
    }),
  );

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading…</div>}>
          <ConversationVideos />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
