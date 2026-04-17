// components/remotion/conversation/conversation-composition.tsx
import React, { useMemo } from "react";
import { AbsoluteFill, Audio, useVideoConfig } from "remotion";
import { ConversationVideo } from "../../../types";
import { CaptionData, CaptionsLayer } from "../captions-layer";
import { CAPTION_PRESETS, DEFAULT_CAPTION_STYLE } from "../../../lib/constants";
import { CaptionStyle } from "../../../types";
import { BackgroundVideoLayer } from "./background-video-layer";
import { SpeakerLayer, buildSpeakerTurns } from "./speaker-layer";

// ─── DEV TESTING ──────────────────────────────────────────────────────────────
// Set to a preset id to force that style in Remotion Studio, ignoring DB captionConfig.
// Set to null to use the real captionConfig from defaultProps / production.
//
// Available preset ids: "viral-green" | "purple-pill" | "comic-bold" |
//                        "minimal-clean" | "tiktok-yellow" | "neon-glow" | "storyteller"
const DEV_PRESET_ID: string | null = null;

// ─── Caption config resolver ───────────────────────────────────────────────────
// Mirrors the same logic in remotion-composition.tsx exactly.

function resolveCaptionStyle(
  captionConfig: ConversationVideo["captionConfig"],
): CaptionStyle | null {
  // DEV override — short-circuits everything when set
  if (DEV_PRESET_ID !== null) {
    const preset = CAPTION_PRESETS.find((p) => p.id === DEV_PRESET_ID);
    if (preset) return preset.style;
  }

  // No captionConfig attached → do not render captions
  if (!captionConfig) return null;

  const db = captionConfig as any;

  const basePreset = db.presetId
    ? CAPTION_PRESETS.find((p: any) => p.id === db.presetId)?.style
    : undefined;

  const base: CaptionStyle = basePreset ?? DEFAULT_CAPTION_STYLE;

  return {
    ...base,
    textColor: db.textColor ?? base.textColor,
    strokeColor: db.strokeColor ?? base.strokeColor,
    highlightColor: db.highlightColor ?? base.highlightColor,
    highlightStrokeColor: db.highlightStrokeColor ?? base.highlightStrokeColor,
    popBackgroundColor:
      db.popBackgroundColor ?? db.backgroundColor ?? base.popBackgroundColor,
    strokeWidth: db.strokeWidth ?? base.strokeWidth,
    fontSize: db.fontSize ?? base.fontSize,
    verticalPosition: db.verticalPosition ?? base.verticalPosition,
    horizontalPosition: db.horizontalPosition ?? base.horizontalPosition,
    maxLines: db.maxLines ?? base.maxLines,
    maxWordsPerLine: db.maxWordsPerLine ?? base.maxWordsPerLine,
    shadowOffsetY: db.shadowOffsetY ?? base.shadowOffsetY,
    shadowBlur: db.shadowBlur ?? base.shadowBlur,
    fontFamily: db.fontType ?? db.fontFamily ?? base.fontFamily,
    fontWeight: db.fontWeight ?? base.fontWeight,
    textTransform: db.textTransform ?? base.textTransform,
    letterSpacing: db.letterSpacing ?? base.letterSpacing,
    animationPreset: db.animationPreset ?? base.animationPreset,
    lightLeakHue: db.lightLeakHue ?? base.lightLeakHue,
    lightLeakSeed: db.lightLeakSeed ?? base.lightLeakSeed,
  };
}

// ─── Root Composition ─────────────────────────────────────────────────────────

export default function ConversationVideoComposition({
  videoData,
}: {
  videoData: ConversationVideo;
}) {
  const { width, height, durationInFrames } = useVideoConfig();

  // ── Caption style ──────────────────────────────────────────────────────────
  const captionStyle = useMemo(
    () => resolveCaptionStyle(videoData.captionConfig),
    [videoData.captionConfig],
  );

  const captionData = videoData.caption as CaptionData | null;

  // ── Speaker turns ──────────────────────────────────────────────────────────
  // Build turn windows from flat caption words + script line word counts.
  const speakerTurns = useMemo(() => {
    if (!captionData?.words?.length || !videoData.script.content.length) {
      return [];
    }
    return buildSpeakerTurns(captionData.words, videoData.script.content);
  }, [captionData?.words, videoData.script.content]);

  return (
    <AbsoluteFill>
      {/* ── 1. Looping background video ── */}
      {videoData.backgroundVideoUrl && (
        <BackgroundVideoLayer
          backgroundVideoUrl={videoData.backgroundVideoUrl}
        />
      )}

      {/*
        ── 3. Captions ──
        Rendered ONLY when:
          • captionStyle is non-null  (captionConfig exists on the video)
          • captionData has words
      */}
      {captionStyle && captionData && captionData?.words?.length > 0 && (
        <CaptionsLayer
          captionData={captionData}
          style={captionStyle}
          totalDurationInFrames={durationInFrames}
          canvasWidth={width}
          canvasHeight={height}
        />
      )}

      {/* ── 2. Speaker avatars (slide in/out per turn) ── */}
      {speakerTurns.length > 0 && (
        <SpeakerLayer
          speakerTurns={speakerTurns}
          speaker1AvatarUrl={videoData.speaker1AvatarUrl}
          speaker2AvatarUrl={videoData.speaker2AvatarUrl}
          canvasWidth={width}
          canvasHeight={height}
        />
      )}

      {/* ── 4. Combined dialogue audio ── */}
      {videoData.audioUrl && <Audio src={videoData.audioUrl} />}

      {/* ── 5. Background music (lower volume) ── */}
      {videoData.backgroundMusicUrl && (
        <Audio volume={0.25} src={videoData.backgroundMusicUrl} />
      )}
    </AbsoluteFill>
  );
}
