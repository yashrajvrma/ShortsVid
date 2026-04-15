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

// ── Speaker badge ─────────────────────────────────────────────────────────────
function SpeakerBadge({
  label,
  avatarUrl,
  mimeType,
  variant,
}: {
  label: string;
  avatarUrl: string | null;
  mimeType: string | null;
  variant: "primary" | "secondary";
}) {
  const isVideo = mimeType?.startsWith("video/") ?? false;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div
        className={`size-7 rounded-full overflow-hidden border-2 ${
          variant === "primary"
            ? "border-primary"
            : "border-muted-foreground/40"
        } bg-muted`}
      >
        {avatarUrl ? (
          isVideo ? (
            <video
              src={avatarUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={avatarUrl}
              alt={label}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-muted-foreground">
            {label}
          </div>
        )}
      </div>
      <span className="text-[8px] font-semibold text-white/80">{label}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function ConversationMockupPreview({
  form,
}: ConversationMockupPreviewProps) {
  const trpc = useTRPC();

  const { data: videoData } = useQuery(
    trpc.stocks.getSystemBackgroundVideos.queryOptions(),
  );
  const { data: avatarData } = useQuery(
    trpc.stocks.getSystemAiAvatars.queryOptions(),
  );

  const selectedVideo =
    form.backgroundVideoId != null
      ? (videoData?.videos ?? []).find((v) => v.id === form.backgroundVideoId)
      : null;

  const avatars = (avatarData?.avatars ?? []) as Array<{
    id: string;
    name: string;
    mimeType: string | null;
    avatarUrl: string;
  }>;

  const speaker1Avatar =
    form.speaker1AvatarId != null
      ? avatars.find((a) => a.id === form.speaker1AvatarId) ?? null
      : null;

  const speaker2Avatar =
    form.speaker2AvatarId != null
      ? avatars.find((a) => a.id === form.speaker2AvatarId) ?? null
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

            {/* Dark scrim */}
            <div className="absolute inset-0 bg-black/25" />

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
                avatarUrl={speaker1Avatar?.avatarUrl ?? null}
                mimeType={speaker1Avatar?.mimeType ?? null}
                variant="primary"
              />
              <SpeakerBadge
                label="S2"
                avatarUrl={speaker2Avatar?.avatarUrl ?? null}
                mimeType={speaker2Avatar?.mimeType ?? null}
                variant="secondary"
              />
            </div>

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
