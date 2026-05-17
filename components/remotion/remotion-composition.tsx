// // components\remotion\remotion-composition.tsx
// import { CaptionStyle, ShortsVideo } from "../../types/index";
// import { useMemo } from "react";
// import { AbsoluteFill, Html5Audio, useVideoConfig } from "remotion";

// // ⚠️ CRITICAL: Must be the first local import — importing this module fires
// // delayRender() as a side-effect, which blocks Lambda's renderer until ALL
// // fonts (Google + local komikaAxis) are fully fetched over the network.
// import { FONT_FAMILIES, FontKey } from "./fonts";

// import { CaptionData, CaptionsLayer } from "./captions-layer";
// import { ImagesLayer } from "./images-layer";
// import { CAPTION_PRESETS, DEFAULT_CAPTION_STYLE } from "../../lib/constants";

// // ─── DEV TESTING ──────────────────────────────────────────────────────────────
// // Set this to any preset id from caption-types.ts to force that style in the
// // Remotion Studio preview, regardless of what videoData.captionConfig contains.
// // Set to null to use the real captionConfig from videoData (production mode).
// //
// // Available preset ids: "viral-green" | "purple-pill" | "comic-bold" |
// //                        "minimal-clean" | "tiktok-yellow" | "neon-glow" | "storyteller"
// const DEV_PRESET_ID: string | null = null;

// // ─── Font family resolver ──────────────────────────────────────────────────────
// // DB stores font names as plain strings (e.g. "Montserrat", "montserrat",
// // "oswald"). We normalize to the exact CSS family name that @remotion/google-fonts
// // registered, falling back to the raw DB string if no match is found.
// function resolveFontFamily(
//   rawFont: string | undefined | null,
//   fallback: string,
// ): string {
//   if (!rawFont) return fallback;

//   // Case-insensitive lookup against FONT_FAMILIES keys
//   const key = Object.keys(FONT_FAMILIES).find(
//     (k) => k.toLowerCase() === rawFont.toLowerCase(),
//   ) as FontKey | undefined;

//   if (key) return FONT_FAMILIES[key];

//   // Also check if the raw string matches a fontFamily value directly
//   // (e.g. DB stores the CSS family name like "Montserrat" already)
//   const byValue = Object.values(FONT_FAMILIES).find(
//     (v) => v.toLowerCase() === rawFont.toLowerCase(),
//   );
//   if (byValue) return byValue;

//   // Last resort — use raw string (may fail if not registered)
//   return rawFont;
// }

// // ─── Caption config resolver ───────────────────────────────────────────────────
// // Priority:  DEV_PRESET_ID (dev only)  >  DB captionConfig  >  DEFAULT_CAPTION_STYLE
// // If captionConfigId is null and DEV_PRESET_ID is null → captions are skipped.

// function resolveCaptionStyle(
//   captionConfig: ShortsVideo["captionConfig"],
// ): CaptionStyle | null {
//   // DEV override — short-circuits everything when set
//   if (DEV_PRESET_ID !== null) {
//     const preset = CAPTION_PRESETS.find((p) => p.id === DEV_PRESET_ID);
//     if (preset) return preset.style;
//   }

//   // No captionConfig attached → do not render captions
//   if (!captionConfig) return null;

//   const db = captionConfig as any;

//   // If the DB record carries a presetId, start from that preset's style
//   const basePreset = db.presetId
//     ? CAPTION_PRESETS.find((p) => p.id === db.presetId)?.style
//     : undefined;

//   const base: CaptionStyle = basePreset ?? DEFAULT_CAPTION_STYLE;

//   return {
//     ...base,
//     // Colors
//     textColor: db.textColor ?? base.textColor,
//     strokeColor: db.strokeColor ?? base.strokeColor,
//     highlightColor: db.highlightColor ?? base.highlightColor,
//     highlightStrokeColor: db.highlightStrokeColor ?? base.highlightStrokeColor,
//     popBackgroundColor:
//       db.popBackgroundColor ?? db.backgroundColor ?? base.popBackgroundColor,
//     // Effects
//     strokeWidth: db.strokeWidth ?? base.strokeWidth,
//     fontSize: db.fontSize ?? base.fontSize,
//     verticalPosition: db.verticalPosition ?? base.verticalPosition,
//     horizontalPosition: db.horizontalPosition ?? base.horizontalPosition,
//     maxLines: db.maxLines ?? base.maxLines,
//     maxWordsPerLine: db.maxWordsPerLine ?? base.maxWordsPerLine,
//     shadowOffsetY: db.shadowOffsetY ?? base.shadowOffsetY,
//     shadowBlur: db.shadowBlur ?? base.shadowBlur,
//     // Typography — resolve through FONT_FAMILIES to guarantee correct CSS name
//     fontFamily: resolveFontFamily(
//       db.fontType ?? db.fontFamily,
//       base.fontFamily,
//     ),
//     fontWeight: db.fontWeight ?? base.fontWeight,
//     textTransform: db.textTransform ?? base.textTransform,
//     letterSpacing: db.letterSpacing ?? base.letterSpacing,
//     // Animation
//     animationPreset: db.animationPreset ?? base.animationPreset,
//     // Light leak
//     lightLeakHue: db.lightLeakHue ?? base.lightLeakHue,
//     lightLeakSeed: db.lightLeakSeed ?? base.lightLeakSeed,
//   };
// }

// // ─── Root Composition ─────────────────────────────────────────────────────────

// export default function RemotionComposition({
//   videoData,
// }: {
//   videoData: ShortsVideo;
// }) {
//   const { width, height, durationInFrames } = useVideoConfig();

//   const captionStyle = useMemo(
//     () => resolveCaptionStyle(videoData.captionConfig),
//     [videoData.captionConfig],
//   );

//   const captionData = videoData.caption as CaptionData | null;

//   return (
//     <AbsoluteFill>
//       {/* ── Images with Ken Burns zoom + light leak overlays ── */}
//       <ImagesLayer
//         imagesList={videoData.imagesUrl}
//         lightLeakHue={
//           captionStyle?.lightLeakHue ?? DEFAULT_CAPTION_STYLE.lightLeakHue
//         }
//         lightLeakSeed={
//           captionStyle?.lightLeakSeed ?? DEFAULT_CAPTION_STYLE.lightLeakSeed
//         }
//       />

//       {/*
//         ── Captions ──
//         Rendered ONLY when:
//           • captionStyle is non-null (captionConfig exists on the video)
//           • captionData has words
//       */}
//       {captionStyle && captionData && captionData?.words?.length > 0 && (
//         <CaptionsLayer
//           captionData={captionData}
//           style={captionStyle}
//           totalDurationInFrames={durationInFrames}
//           canvasWidth={width}
//           canvasHeight={height}
//         />
//       )}

//       {/* ── Voiceover audio ── */}
//       {videoData?.audioUrl && <Html5Audio src={videoData.audioUrl} />}

//       {/* ── Background Music ── */}
//       {videoData?.backgroundMusicUrl && (
//         <Html5Audio volume={0.2} src={videoData.backgroundMusicUrl} />
//       )}
//     </AbsoluteFill>
//   );
// }

// components\remotion\remotion-composition.tsx
import { CaptionStyle, ShortsVideo } from "../../types/index";
import { useMemo } from "react";
import { AbsoluteFill, Html5Audio, useVideoConfig } from "remotion";

// ⚠️ CRITICAL: This import fires delayRender() as a side-effect, blocking
// Lambda's renderer until ALL fonts are loaded. This file is only ever
// imported inside the Remotion bundle (via lazy() in remotion-player.tsx
// and directly in Root.tsx) — never from a Next.js SSR context.
import { FONT_FAMILIES, FontKey } from "./fonts";

import { CaptionData, CaptionsLayer } from "./captions-layer";
import { ImagesLayer } from "./images-layer";
import { CAPTION_PRESETS, DEFAULT_CAPTION_STYLE } from "../../lib/constants";

// ─── DEV TESTING ──────────────────────────────────────────────────────────────
const DEV_PRESET_ID: string | null = null;

// ─── Font family resolver ──────────────────────────────────────────────────────
// Normalizes raw DB font strings to the exact CSS family name registered by
// @remotion/google-fonts, preventing fallback fonts on Lambda.
function resolveFontFamily(
  rawFont: string | undefined | null,
  fallback: string,
): string {
  if (!rawFont) return fallback;

  // Case-insensitive lookup against FONT_FAMILIES keys (e.g. "montserrat")
  const key = Object.keys(FONT_FAMILIES).find(
    (k) => k.toLowerCase() === rawFont.toLowerCase(),
  ) as FontKey | undefined;
  if (key) return FONT_FAMILIES[key];

  // Check if raw string matches a registered CSS family value (e.g. "Montserrat")
  const byValue = Object.values(FONT_FAMILIES).find(
    (v) => v.toLowerCase() === rawFont.toLowerCase(),
  );
  if (byValue) return byValue;

  // Last resort — pass through as-is
  return rawFont;
}

// ─── Caption config resolver ───────────────────────────────────────────────────

function resolveCaptionStyle(
  captionConfig: ShortsVideo["captionConfig"],
): CaptionStyle | null {
  if (DEV_PRESET_ID !== null) {
    const preset = CAPTION_PRESETS.find((p) => p.id === DEV_PRESET_ID);
    if (preset) return preset.style;
  }

  if (!captionConfig) return null;

  const db = captionConfig as any;

  const basePreset = db.presetId
    ? CAPTION_PRESETS.find((p) => p.id === db.presetId)?.style
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
    // ✅ Resolved through FONT_FAMILIES — guarantees correct CSS name on Lambda
    fontFamily: resolveFontFamily(
      db.fontType ?? db.fontFamily,
      base.fontFamily,
    ),
    fontWeight: db.fontWeight ?? base.fontWeight,
    textTransform: db.textTransform ?? base.textTransform,
    letterSpacing: db.letterSpacing ?? base.letterSpacing,
    animationPreset: db.animationPreset ?? base.animationPreset,
    lightLeakHue: db.lightLeakHue ?? base.lightLeakHue,
    lightLeakSeed: db.lightLeakSeed ?? base.lightLeakSeed,
  };
}

// ─── Root Composition ─────────────────────────────────────────────────────────

export default function RemotionComposition({
  videoData,
}: {
  videoData: ShortsVideo;
}) {
  const { width, height, durationInFrames } = useVideoConfig();

  const captionStyle = useMemo(
    () => resolveCaptionStyle(videoData.captionConfig),
    [videoData.captionConfig],
  );

  const captionData = videoData.caption as CaptionData | null;

  return (
    <AbsoluteFill>
      <ImagesLayer
        imagesList={videoData.imagesUrl}
        lightLeakHue={
          captionStyle?.lightLeakHue ?? DEFAULT_CAPTION_STYLE.lightLeakHue
        }
        lightLeakSeed={
          captionStyle?.lightLeakSeed ?? DEFAULT_CAPTION_STYLE.lightLeakSeed
        }
      />

      {captionStyle && captionData && captionData?.words?.length > 0 && (
        <CaptionsLayer
          captionData={captionData}
          style={captionStyle}
          totalDurationInFrames={durationInFrames}
          canvasWidth={width}
          canvasHeight={height}
        />
      )}

      {videoData?.audioUrl && <Html5Audio src={videoData.audioUrl} />}

      {videoData?.backgroundMusicUrl && (
        <Html5Audio volume={0.2} src={videoData.backgroundMusicUrl} />
      )}
    </AbsoluteFill>
  );
}
