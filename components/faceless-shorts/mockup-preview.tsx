"use client";

import type { FacelessFormState } from "@/hooks/use-faceless-form";
import { VIDEO_STYLES } from "@/lib/constants";
import type { CaptionStyle } from "@/types";
import { CaptionAnimationOverlay } from "../captions/caption-animation-overlay";

const MOCKUP_WIDTH = 240;

interface MockupPreviewProps {
  form: FacelessFormState & {
    captionConfig: CaptionStyle;
    captionsEnabled: boolean;
  };
}

export function MockupPreview({ form }: MockupPreviewProps) {
  const selectedStyle = VIDEO_STYLES.find(
    (s) => String(s.id) === form.videoStyle,
  );

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 py-6">
      {/* Phone shell */}
      <div
        className="relative shrink-0"
        style={{ width: `${MOCKUP_WIDTH}px`, aspectRatio: "9/16" }}
      >
        <div className="absolute inset-0 rounded-[30px] border-[5px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
          <div className="absolute inset-0 overflow-hidden rounded-[25px]">
            {/* Background image or gradient */}
            {selectedStyle?.thumbnail ? (
              <img
                src={selectedStyle.thumbnail}
                alt={selectedStyle.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950" />
            )}

            {/* Dark scrim */}
            <div className="absolute inset-0 bg-black/15" />

            {/* Live caption overlay — only when captions enabled */}
            {form.captionsEnabled && (
              <CaptionAnimationOverlay
                style={form.captionConfig}
                containerWidth={MOCKUP_WIDTH}
              />
            )}

            {/* Style badge */}
            {selectedStyle && (
              <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                <span className="text-[8px] font-semibold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {selectedStyle.label}
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
          Adjust settings to update the preview
        </p>
      </div>
    </div>
  );
}
