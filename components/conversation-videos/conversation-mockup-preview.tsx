"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import type { ConversationFormState } from "@/hooks/use-conversation-form";
import type { CaptionStyle } from "@/types";
import { CaptionAnimationOverlay } from "../captions/caption-animation-overlay";

const MOCKUP_WIDTH = 240;

interface ConversationMockupPreviewProps {
  form: ConversationFormState & {
    captionConfig: CaptionStyle;
    captionsEnabled: boolean;
  };
}

// ── Main component ────────────────────────────────────────────────────────────
export function ConversationMockupPreview({
  form,
}: ConversationMockupPreviewProps) {
  const trpc = useTRPC();

  const { data: videoData } = useQuery(
    trpc.stocks.getSystemBackgroundVideos.queryOptions(),
  );

  const selectedVideo =
    form.backgroundVideoId != null
      ? (videoData?.videos ?? []).find((v) => v.id === form.backgroundVideoId)
      : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 py-6">
      {/* Phone shell */}
      <div
        className="relative shrink-0"
        style={{ width: `${MOCKUP_WIDTH}px`, aspectRatio: "9/16" }}
      >
        <div className="absolute inset-0 rounded-[30px] border-[5px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
          <div className="absolute inset-0 overflow-hidden rounded-[25px]">
            {/* Background thumbnail / gradient */}
            {selectedVideo?.thumbnailUrl ? (
              <img
                src={selectedVideo.thumbnailUrl}
                alt={selectedVideo.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-green-900 to-slate-950" />
            )}
            {form.captionsEnabled && (
              <CaptionAnimationOverlay
                style={form.captionConfig}
                containerWidth={MOCKUP_WIDTH}
              />
            )}

            {/* Video name badge at top */}
            {selectedVideo && (
              <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                <span className="text-[8px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {selectedVideo.name}
                </span>
              </div>
            )}
          </div>

          {/* Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-foreground/15 z-10" />
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-0.5">
        <p className="text-sm font-semibold text-foreground">Live Preview</p>
        <p className="text-xs text-muted-foreground text-center max-w-[180px]">
          {selectedVideo
            ? `Background: ${selectedVideo.name}`
            : "Select a background video to preview"}
        </p>
      </div>
    </div>
  );
}

// "use client";

// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";
// import type { ConversationFormState } from "@/hooks/use-conversation-form";
// import type { CaptionStyle } from "@/types";
// import { CaptionAnimationOverlay } from "../captions/caption-animation-overlay";

// const MOCKUP_WIDTH = 240;

// interface ConversationMockupPreviewProps {
//   form: ConversationFormState & {
//     captionConfig: CaptionStyle;
//     captionsEnabled: boolean;
//   };
// }

// // ── Main component ────────────────────────────────────────────────────────────
// export function ConversationMockupPreview({
//   form,
// }: ConversationMockupPreviewProps) {
//   const trpc = useTRPC();

//   const { data: videoData } = useQuery(
//     trpc.stocks.getSystemBackgroundVideos.queryOptions(),
//   );

//   const { data: detail } = useQuery({
//     ...trpc.stocks.getBackgroundVideoById.queryOptions({
//       videoId: form.backgroundVideoId!,
//     }),
//     enabled: form.backgroundVideoId != null,
//     staleTime: 5 * 60 * 1000,
//   });

//   const videoUrl = detail?.videoUrl ?? null;

//   const selectedVideo =
//     form.backgroundVideoId != null
//       ? (videoData?.videos ?? []).find((v) => v.id === form.backgroundVideoId)
//       : null;

//   return (
//     <div className="flex flex-col items-center justify-center h-full gap-5 py-6">
//       {/* Phone shell */}
//       <div
//         className="relative shrink-0"
//         style={{ width: `${MOCKUP_WIDTH}px`, aspectRatio: "9/16" }}
//       >
//         <div className="absolute inset-0 rounded-[30px] border-[5px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
//           <div className="absolute inset-0 overflow-hidden rounded-[25px]">
//             {/* Background thumbnail / gradient */}
//             {videoUrl ? (
//               <video
//                 src={videoUrl}
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//             ) : selectedVideo?.thumbnailUrl ? (
//               <img
//                 src={selectedVideo.thumbnailUrl}
//                 alt={selectedVideo.name}
//                 className="absolute inset-0 w-full h-full object-cover"
//               />
//             ) : (
//               <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-green-900 to-slate-950" />
//             )}
//             {form.captionsEnabled && (
//               <CaptionAnimationOverlay
//                 style={form.captionConfig}
//                 containerWidth={MOCKUP_WIDTH}
//               />
//             )}

//             {/* Video name badge at top */}
//             {selectedVideo && (
//               <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
//                 <span className="text-[8px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
//                   {selectedVideo.name}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Notch */}
//           <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-foreground/15 z-10" />
//         </div>
//       </div>

//       {/* Label */}
//       <div className="flex flex-col items-center gap-0.5">
//         <p className="text-sm font-semibold text-foreground">Live Preview</p>
//         <p className="tLive s text-muted-foreground text-center max-w-[180px]">
//           {selectedVideo
//             ? `Background: ${selectedVideo.name}`
//             : "Select a background video to preview"}
//         </p>
//       </div>
//     </div>
//   );
// }
