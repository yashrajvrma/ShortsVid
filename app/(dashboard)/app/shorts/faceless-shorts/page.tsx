import type { Metadata } from "next";
import FacelessShorts from "@/components/faceless-shorts";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LANGUAGES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Create Faceless Shorts",
  description:
    "Generate AI-powered faceless YouTube Shorts with custom voiceover, captions, and background music.",
  robots: { index: false, follow: false },
};

export default async function FacelessShortsPage() {
  prefetch(trpc.stocks.getAllBackgroundMusic.queryOptions());
  prefetch(
    trpc.voices.getSystemVoice.queryOptions({
      languageCode: LANGUAGES[0].code,
    }),
  );

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<div>Loading...</div>}>
          <FacelessShorts />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
