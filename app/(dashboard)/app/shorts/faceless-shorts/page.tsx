import FacelessShorts from "@/components/faceless-shorts";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LANGUAGES } from "@/lib/constants";

export default async function FacelessShortsPage() {
  void prefetch(trpc.stocks.getAllBackgroundMusic.queryOptions());
  void prefetch(
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
