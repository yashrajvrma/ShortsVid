// components/remotion/conversation/speaker-layer.tsx
import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CaptionWord } from "../captions-layer";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface SpeakerTurn {
  speaker: 1 | 2;
  /** Composition-absolute start time in seconds */
  startSec: number;
  /** Composition-absolute end time in seconds */
  endSec: number;
}

interface SpeakerAvatarProps {
  src: string;
  /** 1 = slide in/out from the LEFT;  2 = slide in/out from the RIGHT */
  side: 1 | 2;
  /** Total duration of this turn in frames (passed from parent since useVideoConfig gives composition-level) */
  turnDurationFrames: number;
  canvasWidth: number;
  canvasHeight: number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

/** Duration of slide-in / slide-out animation in frames (~0.4 s at 30 fps) */
const SLIDE_FRAMES = 12;

/** Avatar height as % of canvas height. Mirrors the reference image (full-body, feet at bottom) */
// const AVATAR_HEIGHT_RATIO = 0.65;
const AVATAR_HEIGHT_RATIO = 0.35;

// ─── Speaker turn → time windows ──────────────────────────────────────────────

/**
 * Splits the flat caption word array into per-script-line groups using the
 * word count of each script line. Even-indexed lines → Speaker 1, Odd → Speaker 2.
 *
 * Caveat: Whisper may occasionally add/drop filler words; in practice the
 * word-count split is accurate for TTS-generated audio that directly narrates
 * the script text.
 */
export function buildSpeakerTurns(
  words: CaptionWord[],
  scriptLines: string[],
): SpeakerTurn[] {
  const turns: SpeakerTurn[] = [];
  let wordIdx = 0;

  for (let lineIdx = 0; lineIdx < scriptLines.length; lineIdx++) {
    const lineWordCount = scriptLines[lineIdx].trim().split(/\s+/).length;
    const lineWords = words.slice(wordIdx, wordIdx + lineWordCount);

    // Guard: no words left to consume (should not happen in production)
    if (lineWords.length === 0) break;

    turns.push({
      speaker: lineIdx % 2 === 0 ? 1 : 2,
      startSec: lineWords[0].start,
      endSec: lineWords[lineWords.length - 1].end,
    });

    wordIdx += lineWordCount;
  }

  return turns;
}

// ─── Single avatar turn ────────────────────────────────────────────────────────

const SpeakerAvatar: React.FC<SpeakerAvatarProps> = ({
  src,
  side,
  turnDurationFrames,
  canvasWidth,
  canvasHeight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Guard: Remotion's <Img> throws if src is empty — skip render in dev/Studio
  // when placeholder default props are used.
  // if (!src) return null;

  // ── Slide-in spring (from 0 at sequence start → 1) ────────────────────────
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 180, mass: 1 },
    durationInFrames: SLIDE_FRAMES,
  });

  // ── Slide-out spring (starts SLIDE_FRAMES before sequence end) ─────────────
  const slideOutDelay = Math.max(0, turnDurationFrames - SLIDE_FRAMES);
  const slideOut = spring({
    frame: frame - slideOutDelay,
    fps,
    config: { damping: 22, stiffness: 180, mass: 1 },
    durationInFrames: SLIDE_FRAMES,
  });

  /*
   * For Speaker 1 (LEFT side):
   *   hidden  → translateX: -100%  (off-screen left)
   *   visible → translateX: 0%
   *
   * For Speaker 2 (RIGHT side):
   *   hidden  → translateX: +100%  (off-screen right)
   *   visible → translateX: 0%
   *
   * Combined:
   *   translateX = slideIn maps [0→1] from hidden→visible
   *              + slideOut maps [0→1] from visible→hidden
   */
  const direction = side === 1 ? -1 : 1; // -1 = left, +1 = right

  const xPercent =
    interpolate(slideIn, [0, 1], [direction * 100, 0]) +
    interpolate(slideOut, [0, 1], [0, direction * 100]);

  const avatarHeight = canvasHeight * AVATAR_HEIGHT_RATIO;

  // Position: Speaker 1 anchors to left edge, Speaker 2 to right edge
  const positionStyle: React.CSSProperties =
    side === 1 ? { left: 0, bottom: 0 } : { right: 0, bottom: 0 };

  return (
    <div
      style={{
        position: "absolute",
        ...positionStyle,
        transform: `translateX(${xPercent}%)`,
        // GPU-accelerated transform — no CSS transition/animation
        height: avatarHeight,
        width: "auto",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <Img
        src={src}
        style={{
          height: avatarHeight,
          width: "auto",
          objectFit: "contain",
          objectPosition: "bottom",
          // paddingInline: "50px",
          margin: "80px",
          // Drop-shadow so avatar pops over any background
          filter: "drop-shadow(0px 8px 24px rgba(0,0,0,0.55))",
        }}
      />
    </div>
  );
};

// ─── Speaker Layer ─────────────────────────────────────────────────────────────

interface SpeakerLayerProps {
  speakerTurns: SpeakerTurn[];
  speaker1AvatarUrl: string;
  speaker2AvatarUrl: string;
  canvasWidth: number;
  canvasHeight: number;
}

export const SpeakerLayer: React.FC<SpeakerLayerProps> = ({
  speakerTurns,
  speaker1AvatarUrl,
  speaker2AvatarUrl,
  canvasWidth,
  canvasHeight,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {speakerTurns.map((turn, index) => {
        const startFrame = Math.floor(turn.startSec * fps);
        const endFrame = Math.ceil(turn.endSec * fps);
        const duration = Math.max(endFrame - startFrame, 1);

        const avatarUrl =
          turn.speaker === 1 ? speaker1AvatarUrl : speaker2AvatarUrl;

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
            // Premount so the image is fully loaded before it slides in
            premountFor={SLIDE_FRAMES}
          >
            <SpeakerAvatar
              src={avatarUrl}
              side={turn.speaker}
              turnDurationFrames={duration}
              canvasWidth={canvasWidth}
              canvasHeight={canvasHeight}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
