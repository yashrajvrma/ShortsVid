"use client";

import { useState, useEffect, useRef } from "react";
import type { CaptionStyle } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

// Actual Remotion canvas is 1080 wide. Scale is computed per-usage.
export const CANVAS_WIDTH = 1080;

// Dummy words for live preview — cycling through these simulates playback
export const DUMMY_WORDS = [
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

// ─── Animation keyframe CSS ───────────────────────────────────────────────────

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
export function injectAnimCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const tag = document.createElement("style");
  tag.textContent = ANIM_CSS;
  document.head.appendChild(tag);
  cssInjected = true;
}

// ─── CaptionOverlay ───────────────────────────────────────────────────────────

interface CaptionOverlayProps {
  style: CaptionStyle;
  /**
   * The width (px) of the container this overlay sits inside.
   * Used to compute the correct scale factor relative to the 1080px canvas.
   */
  containerWidth: number;
  /**
   * Interval in ms between word advances. Defaults to 550.
   */
  intervalMs?: number;
}

export function CaptionAnimationOverlay({
  style,
  containerWidth,
  intervalMs = 550,
}: CaptionOverlayProps) {
  useEffect(() => {
    injectAnimCSS();
  }, []);

  const scale = containerWidth / CANVAS_WIDTH;

  const [tick, setTick] = useState(0);
  const tickRef = useRef(0);

  useEffect(() => {
    tickRef.current = 0;
    setTick(0);
  }, [style]);

  useEffect(() => {
    const id = setInterval(() => {
      tickRef.current = (tickRef.current + 1) % DUMMY_WORDS.length;
      setTick(tickRef.current);
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  // ── Build groups ──────────────────────────────────────────────────────────
  const wordsPerGroup = Math.max(1, style.maxLines * style.maxWordsPerLine);
  const groupIndex = Math.floor(tick / wordsPerGroup);
  const posInGroup = tick % wordsPerGroup;

  const groupStart = groupIndex * wordsPerGroup;
  const groupWords = DUMMY_WORDS.slice(groupStart, groupStart + wordsPerGroup);

  const lines: string[][] = [];
  for (let l = 0; l < style.maxLines; l++) {
    const start = l * style.maxWordsPerLine;
    const slice = groupWords.slice(start, start + style.maxWordsPerLine);
    if (slice.length > 0) lines.push(slice);
  }

  const activeWordInGroup = posInGroup;

  // ── Scaled values ─────────────────────────────────────────────────────────
  const scaledFontSize = style.fontSize * scale;
  const scaledStroke = style.strokeWidth * scale;
  const scaledLetterSpacing =
    (style.letterSpacing / style.fontSize) * scaledFontSize;
  const scaledShadowY = style.shadowOffsetY * scale;
  const scaledShadowBlur = style.shadowBlur * scale;

  // ── Position ──────────────────────────────────────────────────────────────
  const top = `${Math.min(Math.max(style.verticalPosition, 5), 90)}%`;
  const left = `${Math.min(Math.max(style.horizontalPosition, 5), 95)}%`;

  // ── Animation name ────────────────────────────────────────────────────────
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
                  borderRadius: hasPill ? `${3 * scale}px` : undefined,
                  padding: hasPill
                    ? `${1 * scale}px ${5 * scale}px`
                    : undefined,
                  animation:
                    isActive && animName !== "none"
                      ? `${animName} 0.25s ease forwards`
                      : undefined,
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
