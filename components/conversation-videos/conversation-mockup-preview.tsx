"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import type { ConversationFormState } from "@/hooks/use-conversation-form";
import type { CaptionStyle } from "@/types";
import { CaptionAnimationOverlay } from "../captions/caption-animation-overlay";
import { useVoiceAvatar } from "@/hooks/voice/use-voice-avatar";

const MOCKUP_WIDTH = 240;

interface ConversationMockupPreviewProps {
  form: ConversationFormState & {
    captionConfig: CaptionStyle;
    captionsEnabled: boolean;
  };
}

function SpeakerBadge({
  label,
  avatarSlug,
  variant,
}: {
  label: string;
  avatarSlug: string | null;
  variant: "primary" | "secondary";
}) {
  const avatarSvg = useVoiceAvatar(avatarSlug ?? label);
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`size-7 rounded-full overflow-hidden border-2 ${
          variant === "primary" ? "border-primary" : "border-muted-foreground/40"
        } bg-muted`}
      >
        <div
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
          className="size-full [&>svg]:size-full"
        />
      </div>
      <span className="text-[8px] font-semibold text-white/80">{label}</span>
    </div>
  );
}

export function ConversationMockupPreview({ form }: ConversationMockupPreviewProps) {
  const trpc = useTRPC();

  const { data: videoData } = useQuery(
    trpc.stocks.getBackgroundVideos.queryOptions(),
  );
  const { data: avatarData } = useQuery(
    trpc.stocks.getAiAvatars.queryOptions(),
  );

  const selectedVideo =
    form.backgroundVideoId != null
      ? (videoData?.videos ?? []).find((v) => v.id === form.backgroundVideoId)
      : null;

  const speaker1Avatar =
    form.speaker1AvatarId != null
      ? (avatarData?.avatars ?? []).find((a) => a.id === form.speaker1AvatarId)
      : null;

  const speaker2Avatar =
    form.speaker2AvatarId != null
      ? (avatarData?.avatars ?? []).find((a) => a.id === form.speaker2AvatarId)
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
            {/* Background */}
            {selectedVideo?.thumbnail ? (
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : selectedVideo ? (
              // Placeholder gradient showing the video name
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-900 via-green-900 to-slate-950 flex flex-col items-center justify-center gap-1 px-3">
                <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest">
                  {selectedVideo.category}
                </span>
                <span className="text-[11px] font-semibold text-white/80 text-center leading-tight">
                  {selectedVideo.name}
                </span>
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950" />
            )}

            {/* Dark scrim */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Caption overlay */}
            {form.captionsEnabled && (
              <CaptionAnimationOverlay
                style={form.captionConfig}
                containerWidth={MOCKUP_WIDTH}
              />
            )}

            {/* Speaker avatars at bottom */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-5 z-10">
              <SpeakerBadge
                label="S1"
                avatarSlug={speaker1Avatar?.slug ?? null}
                variant="primary"
              />
              <SpeakerBadge
                label="S2"
                avatarSlug={speaker2Avatar?.slug ?? null}
                variant="secondary"
              />
            </div>

            {/* Video badge */}
            {selectedVideo && (
              <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                <span className="text-[8px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {selectedVideo.category}
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
