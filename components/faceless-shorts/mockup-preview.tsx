"use client";

import type { FacelessFormState } from "@/hooks/use-faceless-form";
import { VIDEO_STYLES } from "@/lib/constants";
import { Smartphone } from "lucide-react";

interface MockupPreviewProps {
  form: FacelessFormState;
}

export function MockupPreview({ form }: MockupPreviewProps) {
  const selectedStyle = VIDEO_STYLES.find(
    (s) => String(s.id) === form.videoStyle,
  );

  const scriptPreview = form.generatedScript
    ? form.generatedScript.slice(0, 120) + (form.generatedScript.length > 120 ? "…" : "")
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 py-6">
      {/* Phone mockup */}
      <div
        className="relative w-[200px] shrink-0"
        style={{ aspectRatio: "9/16" }}
      >
        {/* Phone shell */}
        <div className="absolute inset-0 rounded-[32px] border-[6px] border-foreground/10 bg-foreground/5 shadow-xl overflow-hidden">
          {/* Screen content */}
          <div className="absolute inset-0 overflow-hidden rounded-[26px]">
            {/* Background - style thumbnail or gradient */}
            {selectedStyle?.thumbnail ? (
              <img
                src={selectedStyle.thumbnail}
                alt={selectedStyle.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-950" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Caption preview */}
            {form.generatedScript && (
              <div className="absolute bottom-8 left-0 right-0 px-3 flex items-center justify-center">
                <div
                  className="text-center leading-tight px-2 py-1 rounded"
                  style={{
                    color: form.captionConfig.textColor,
                    fontSize: `${Math.max(8, form.captionConfig.fontSize * 0.2)}px`,
                    WebkitTextStroke: `${form.captionConfig.strokeWidth * 0.2}px ${form.captionConfig.strokeColor}`,
                    backgroundColor: `${form.captionConfig.backgroundColor}33`,
                  }}
                >
                  {scriptPreview}
                </div>
              </div>
            )}

            {/* Style label badge */}
            {selectedStyle && (
              <div className="absolute top-4 left-0 right-0 flex justify-center">
                <span className="text-[9px] font-semibold text-white/70 bg-black/30 px-2 py-0.5 rounded-full">
                  {selectedStyle.label}
                </span>
              </div>
            )}

            {/* Placeholder when no content */}
            {!form.generatedScript && !selectedStyle?.thumbnail && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40">
                <Smartphone className="size-8" />
                <span className="text-[10px] text-center px-4">
                  Your video preview
                  <br />
                  will appear here
                </span>
              </div>
            )}
          </div>

          {/* Phone notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-foreground/15 z-10" />
        </div>
      </div>

      {/* Meta info below mockup */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">Live Preview</p>
        <p className="text-xs text-muted-foreground text-center max-w-[180px]">
          Adjust settings to update the preview
        </p>
      </div>
    </div>
  );
}
