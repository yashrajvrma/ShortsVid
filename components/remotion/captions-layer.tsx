import { CaptionStyle } from "@/types";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Internal types ────────────────────────────────────────────────────────────

export interface CaptionWord {
  word: string;
  start: number; // seconds
  end: number; // seconds
}

export interface CaptionData {
  words: CaptionWord[];
  duration: number;
}

interface WordGroup {
  words: CaptionWord[];
  startMs: number;
  endMs: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function buildWordGroups(
  words: CaptionWord[],
  maxWordsPerLine: number,
  maxLines: number,
): WordGroup[] {
  const wordsPerGroup = Math.max(1, maxWordsPerLine * maxLines);
  const groups: WordGroup[] = [];
  for (let i = 0; i < words.length; i += wordsPerGroup) {
    const slice = words.slice(i, i + wordsPerGroup);
    groups.push({
      words: slice,
      startMs: slice[0].start * 1000,
      endMs: slice[slice.length - 1].end * 1000,
    });
  }
  return groups;
}

/** Keep % within [padding, 100-padding] so text never exits the frame */
function clampPercent(value: number, padding = 5): number {
  return Math.max(padding, Math.min(100 - padding, value));
}

// ─── Word Group Renderer ───────────────────────────────────────────────────────

const CaptionGroupRenderer: React.FC<{
  group: WordGroup;
  style: CaptionStyle;
}> = ({ group, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Absolute time in ms from composition start
  const absoluteTimeMs = group.startMs + (frame / fps) * 1000;

  // ── Entrance animation ───────────────────────────────────────────────────────
  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.5 },
    durationInFrames: 10,
  });

  let entranceStyle: React.CSSProperties = {};
  switch (style.animationPreset) {
    case "pop":
      entranceStyle = {
        transform: `scale(${interpolate(entranceProgress, [0, 1], [0.5, 1])})`,
        opacity: interpolate(entranceProgress, [0, 1], [0, 1]),
      };
      break;
    case "fade":
      entranceStyle = {
        opacity: interpolate(frame, [0, 8], [0, 1], {
          extrapolateRight: "clamp",
        }),
      };
      break;
    case "slide":
      entranceStyle = {
        transform: `translateY(${interpolate(entranceProgress, [0, 1], [50, 0])}px)`,
        opacity: interpolate(entranceProgress, [0, 1], [0, 1]),
      };
      break;
    default:
      break;
  }

  const textShadow =
    style.shadowOffsetY === 0 && style.shadowBlur === 0
      ? undefined
      : `0 ${style.shadowOffsetY}px ${style.shadowBlur}px rgba(0,0,0,0.95)`;

  // Split words into lines
  const lines: CaptionWord[][] = [];
  for (let i = 0; i < group.words.length; i += style.maxWordsPerLine) {
    lines.push(group.words.slice(i, i + style.maxWordsPerLine));
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.15em",
        ...entranceStyle,
      }}
    >
      {lines.map((lineWords, lineIdx) => (
        <div
          key={lineIdx}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            // Explicit gap = proper word spacing (not relying on font spaces)
            gap: "1.5rem",
          }}
        >
          {lineWords.map((word, wordIdx) => {
            const isActive =
              absoluteTimeMs >= word.start * 1000 &&
              absoluteTimeMs <= word.end * 1000;

            // Spring pop on active word — always computed, gated by isActive
            const wordPopSpring = spring({
              frame,
              fps,
              config: { damping: 10, stiffness: 350, mass: 0.35 },
              durationInFrames: 5,
            });
            const wordScale = isActive ? 1 + wordPopSpring * 0.1 : 1;

            const hasPill =
              isActive && style.popBackgroundColor !== "transparent";

            return (
              <span
                key={`${word.word}-${lineIdx}-${wordIdx}`}
                style={{
                  fontFamily: style.fontFamily,
                  fontSize: style.fontSize,
                  fontWeight: style.fontWeight,
                  color: isActive ? style.highlightColor : style.textColor,
                  letterSpacing: style.letterSpacing,
                  WebkitTextStroke:
                    style.strokeWidth > 0
                      ? `${style.strokeWidth}px ${
                          isActive
                            ? style.highlightStrokeColor
                            : style.strokeColor
                        }`
                      : undefined,
                  textShadow,
                  textTransform:
                    style.textTransform === "none"
                      ? undefined
                      : style.textTransform,
                  lineHeight: 1.15,
                  display: "inline-block",
                  transform: `scale(${wordScale})`,
                  // Pill background on active word
                  backgroundColor: hasPill
                    ? style.popBackgroundColor
                    : "transparent",
                  borderRadius: hasPill ? 10 : 0,
                  paddingLeft: hasPill ? "0.12em" : 0,
                  paddingRight: hasPill ? "0.12em" : 0,
                  paddingTop: hasPill ? "0.04em" : 0,
                  paddingBottom: hasPill ? "0.04em" : 0,
                }}
              >
                {word.word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ─── Captions Layer ────────────────────────────────────────────────────────────
// Positions caption groups at the user-defined X/Y % inside the canvas.
// If captionConfig is null → renders nothing (no captions).

export const CaptionsLayer: React.FC<{
  captionData: CaptionData;
  style: CaptionStyle;
  totalDurationInFrames: number;
  canvasWidth: number;
  canvasHeight: number;
}> = ({
  captionData,
  style,
  totalDurationInFrames,
  canvasWidth,
  canvasHeight,
}) => {
  const { fps } = useVideoConfig();

  const groups = useMemo(
    () =>
      buildWordGroups(captionData.words, style.maxWordsPerLine, style.maxLines),
    [captionData.words, style.maxWordsPerLine, style.maxLines],
  );

  const topPx = (clampPercent(style.verticalPosition) / 100) * canvasHeight;
  const leftPx = (clampPercent(style.horizontalPosition) / 100) * canvasWidth;

  // Max-width to prevent text overflow near edges
  const safeH = clampPercent(style.horizontalPosition);
  const maxWidthPercent = Math.min(90, safeH * 2, (100 - safeH) * 2);

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {groups.map((group, index) => {
        const startFrame = Math.floor((group.startMs / 1000) * fps);
        const nextGroup = groups[index + 1];
        const endFrame = nextGroup
          ? Math.floor((nextGroup.startMs / 1000) * fps)
          : totalDurationInFrames;
        const duration = Math.max(endFrame - startFrame, 1);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
            premountFor={5}
          >
            <div
              style={{
                position: "absolute",
                top: topPx,
                left: leftPx,
                // Center anchor on the chosen point
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                maxWidth: `${maxWidthPercent}%`,
              }}
            >
              <CaptionGroupRenderer group={group} style={style} />
            </div>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
