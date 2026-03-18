"use client";

import { useState, useEffect, useRef } from "react";
import type { FacelessFormState } from "@/hooks/use-faceless-form";
import { VIDEO_STYLES } from "@/lib/constants";
import { CaptionStyle } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

// Actual Remotion canvas is 1080 wide. Phone mockup is ~240px wide.
const CANVAS_WIDTH = 1080;
const MOCKUP_WIDTH = 240;
const SCALE = MOCKUP_WIDTH / CANVAS_WIDTH;

// Dummy words for live preview — cycling through these simulates playback
const DUMMY_WORDS = [
  "The",
  "secret",
  "to",
  "going",
  "viral",
  "is",
  "knowing",
  "what",
  "people",
  "truly",
  "crave",
  "online",
];

// ─── Animation keyframe CSS injected once ────────────────────────────────────

const ANIM_CSS = `
@keyframes caption-pop {
  0%   { transform: scale(0.35); opacity: 0; }
  60%  { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1);    opacity: 1; }
}
@keyframes caption-fade {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes caption-slide {
  0%   { transform: translateY(14px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}
`;

let cssInjected = false;
function injectAnimCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = ANIM_CSS;
  document.head.appendChild(tag);
  cssInjected = true;
}

// ─── Caption Overlay ──────────────────────────────────────────────────────────

function CaptionOverlay({ style }: { style: CaptionStyle }) {
  useEffect(() => {
    injectAnimCSS();
  }, []);

  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);

  // Advance one word at a time every 550ms
  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current = (tickRef.current + 1) % DUMMY_WORDS.length;
      setTick(tickRef.current);
    }, 550);
    return () => clearInterval(id);
  }, []);

  // ── Build groups respecting maxLines × maxWordsPerLine ──────────────────
  const wordsPerGroup = Math.max(1, style.maxLines * style.maxWordsPerLine);
  const groupIndex = Math.floor(tick / wordsPerGroup);
  const posInGroup = tick % wordsPerGroup;

  // Slice of words for the current group
  const groupStart = groupIndex * wordsPerGroup;
  const groupWords = DUMMY_WORDS.slice(groupStart, groupStart + wordsPerGroup);

  // Build lines: each line holds maxWordsPerLine words
  const lines: string[][] = [];
  for (let l = 0; l < style.maxLines; l++) {
    const start = l * style.maxWordsPerLine;
    const slice = groupWords.slice(start, start + style.maxWordsPerLine);
    if (slice.length > 0) lines.push(slice);
  }

  // Which word in the flat groupWords array is "active"
  const activeWordInGroup = posInGroup;

  // ── Scaled style values ──────────────────────────────────────────────────
  const scaledFontSize = style.fontSize * SCALE;
  const scaledStroke = style.strokeWidth * SCALE;
  // letterSpacing: keep proportional to font size rather than canvas scale
  // so it stays readable at mockup size
  const scaledLetterSpacing =
    (style.letterSpacing / style.fontSize) * scaledFontSize;
  const scaledShadowY = style.shadowOffsetY * SCALE;
  const scaledShadowBlur = style.shadowBlur * SCALE;

  // ── Position ─────────────────────────────────────────────────────────────
  const top = `${Math.min(Math.max(style.verticalPosition, 5), 90)}%`;
  const left = `${Math.min(Math.max(style.horizontalPosition, 5), 95)}%`;

  // ── Animation ─────────────────────────────────────────────────────────────
  const animName =
    style.animationPreset === "pop"
      ? "caption-pop"
      : style.animationPreset === "fade"
        ? "caption-fade"
        : style.animationPreset === "slide"
          ? "caption-slide"
          : "none";

  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        maxWidth: "90%",
        pointerEvents: "none",
      }}
    >
      {lines.map((lineWords, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexWrap: "nowrap",
            justifyContent: "center",
            gap: `${scaledFontSize * 0.22}px`,
            marginBottom: `${scaledFontSize * 0.1}px`,
          }}
        >
          {lineWords.map((word, wordIdx) => {
            const flatIdx = lineIdx * style.maxWordsPerLine + wordIdx;
            const isActive = flatIdx === activeWordInGroup;

            const displayWord =
              style.textTransform === "uppercase"
                ? word.toUpperCase()
                : style.textTransform === "lowercase"
                  ? word.toLowerCase()
                  : style.textTransform === "capitalize"
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word;

            const color = isActive ? style.highlightColor : style.textColor;
            const strokeColor = isActive
              ? style.highlightStrokeColor
              : style.strokeColor;
            const hasPill =
              isActive && style.popBackgroundColor !== "transparent";

            return (
              <span
                key={`${groupIndex}-${lineIdx}-${wordIdx}`}
                style={{
                  display: "inline-block",
                  fontFamily: style.fontFamily,
                  fontSize: `${scaledFontSize}px`,
                  fontWeight: style.fontWeight,
                  color,
                  letterSpacing: `${scaledLetterSpacing}px`,
                  WebkitTextStroke:
                    scaledStroke > 0
                      ? `${scaledStroke}px ${strokeColor}`
                      : undefined,
                  textShadow:
                    scaledShadowY > 0
                      ? `0 ${scaledShadowY}px ${scaledShadowBlur}px rgba(0,0,0,0.75)`
                      : undefined,
                  backgroundColor: hasPill
                    ? style.popBackgroundColor
                    : undefined,
                  borderRadius: hasPill ? `${3 * SCALE}px` : undefined,
                  padding: hasPill
                    ? `${1 * SCALE}px ${5 * SCALE}px`
                    : undefined,
                  // Animate only the active word each time tick changes
                  animation:
                    isActive && animName !== "none"
                      ? `${animName} 0.25s ease forwards`
                      : undefined,
                  // Force re-trigger animation by keying on tick
                }}
              >
                {displayWord}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── MockupPreview ────────────────────────────────────────────────────────────

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
              <CaptionOverlay style={form.captionConfig} />
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
