// ─── Caption Config Types & Presets ───────────────────────────────────────────
// This file owns all caption-related types and the preset library.
// Import CaptionStyle wherever you need to type caption config.
// Import CAPTION_PRESETS to show template cards in the UI.

import { FONT_FAMILIES } from "./fonts";

export interface CaptionStyle {
  // ── Colors ──────────────────────────────────────────────────────────────────
  /** Resting word color */
  textColor: string;
  /** Stroke/outline color on resting words */
  strokeColor: string;
  /** Color of the currently-spoken word */
  highlightColor: string;
  /** Stroke color on the highlighted word */
  highlightStrokeColor: string;
  /**
   * Background pill behind the active word.
   * Use "transparent" to disable.
   */
  popBackgroundColor: string;

  // ── Effects ─────────────────────────────────────────────────────────────────
  /** Stroke width in px (0–30). Matches "Stroke Width" slider */
  strokeWidth: number;
  /** Font size in px on 1080×1920 canvas (20–150). Matches "Font Size" slider */
  fontSize: number;
  /**
   * Vertical position 0–100 %.
   * 0 = top, 100 = bottom. 5 % padding auto-applied.
   */
  verticalPosition: number;
  /**
   * Horizontal position 0–100 %.
   * 0 = left, 50 = center, 100 = right.
   */
  horizontalPosition: number;
  /** Lines displayed per caption group (1–4). Matches "Max Lines" */
  maxLines: number;
  /** Words shown per line (1–12). Matches "Max Words/Line" */
  maxWordsPerLine: number;
  /** Drop-shadow Y offset in px (0–30). Matches "Shadow Offset" */
  shadowOffsetY: number;
  /** Drop-shadow blur in px (0–60). Matches "Shadow Blur" */
  shadowBlur: number;

  // ── Typography ───────────────────────────────────────────────────────────────
  fontFamily: string;
  fontWeight: string;
  textTransform: "uppercase" | "lowercase" | "capitalize" | "none";
  letterSpacing: number;

  // ── Entrance animation ───────────────────────────────────────────────────────
  animationPreset: "pop" | "fade" | "slide-up" | "none";

  // ── Light leak ───────────────────────────────────────────────────────────────
  /**
   * Hue shift for the LightLeak overlay (0–360).
   * 0 = warm yellow/orange (default).
   * To get a white/neutral leak → set hueShift to 0 AND desaturate via CSS filter.
   * The actual whiteness is controlled by reducing the overlay's opacity in
   * images-layer.tsx; bump LIGHT_LEAK_OPACITY there for a brighter white flash.
   */
  lightLeakHue: number;
  /** Pattern seed 0–9. Different seeds = different leak shapes. */
  lightLeakSeed: number;
}

// ─── Default (fallback) style ─────────────────────────────────────────────────

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  textColor: "#FFFFFF",
  strokeColor: "#000000",
  highlightColor: "#FFFFFF",
  highlightStrokeColor: "#d41ecb",
  popBackgroundColor: "transparent",

  strokeWidth: 0,
  fontSize: 100,
  verticalPosition: 80,
  horizontalPosition: 50,
  maxLines: 1,
  maxWordsPerLine: 2,
  shadowOffsetY: 7,
  shadowBlur: 16,

  fontFamily: FONT_FAMILIES.bebasNeue,
  fontWeight: "600",
  textTransform: "none",
  letterSpacing: 2,

  animationPreset: "pop",

  lightLeakHue: 0,
  lightLeakSeed: 0,
};

// ─── Preset Library ──────────────────────────────────────────────────────────
// Each preset matches one of the TikTok/Reels caption styles shown in the UI.
// Export this array to the client to render template selector cards.

export interface CaptionPreset {
  id: string;
  name: string;
  /** Short description shown in the template card */
  description: string;
  style: CaptionStyle;
}

export const CAPTION_PRESETS: CaptionPreset[] = [
  // ── 1. "Since You Guys Are Curious" style ─────────────────────────────────
  // Green highlight on key word, white resting, dark BG, Impact font
  {
    id: "viral-green",
    name: "Viral Green",
    description: "White words, green highlight — classic talking-head style",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#00FF85",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 6,
      fontSize: 96,
      verticalPosition: 75,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 3,
      shadowOffsetY: 3,
      shadowBlur: 8,

      fontFamily: FONT_FAMILIES.oswald,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 1,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 0,
    },
  },

  // ── 2. "A lot of my clients" style ────────────────────────────────────────
  // Black text on white, purple pill behind active word, rounded font
  {
    id: "purple-pill",
    name: "Purple Pill",
    description: "Dark text, purple highlight pill — clean & modern",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#FFFFFF",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "#6C3CF7",

      strokeWidth: 0.2,
      fontSize: 85,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 0,
      shadowBlur: 0,

      fontFamily: FONT_FAMILIES.montserrat,
      fontWeight: "800",
      textTransform: "none",
      letterSpacing: 0,

      animationPreset: "pop",
      lightLeakHue: 240,
      lightLeakSeed: 3,
    },
  },

  // ── 3. "With Short Hair" style ─────────────────────────────────────────────
  // White chunky text, bold red highlight, heavy black stroke — comic style
  {
    id: "comic-bold",
    name: "Comic Bold",
    description: "White + red, thick stroke — bold comic-book energy",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#fc2b2b",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 1,
      fontSize: 90,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 4,
      shadowBlur: 30,

      fontFamily: FONT_FAMILIES.komikaAxis,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 2,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 1,
    },
  },

  // ── 4. "captions" style — minimal lowercase ────────────────────────────────
  // Off-white, thin font, no stroke, no highlight color change, subtle shadow
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Soft white, thin font — elegant and distraction-free",
    style: {
      textColor: "#F0EFE9",
      strokeColor: "transparent",
      highlightColor: "#F0EFE9",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "transparent",

      strokeWidth: 0,
      fontSize: 90,
      verticalPosition: 85,
      horizontalPosition: 50,
      maxLines: 1,
      maxWordsPerLine: 2,
      shadowOffsetY: 2,
      shadowBlur: 12,

      fontFamily: FONT_FAMILIES.inter,
      fontWeight: "600",
      textTransform: "lowercase",
      letterSpacing: -5,

      animationPreset: "none",
      lightLeakHue: 0,
      lightLeakSeed: 2,
    },
  },

  // ── 5. Yellow highlight — TikTok classic ──────────────────────────────────
  {
    id: "tiktok-yellow",
    name: "TikTok Yellow",
    description: "Yellow active word, white resting — the OG TikTok look",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#FFD600",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 2,
      fontSize: 100,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 1,
      maxWordsPerLine: 2,
      shadowOffsetY: 4,
      shadowBlur: 12,

      fontFamily: FONT_FAMILIES.oswald,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 0,
    },
  },

  // ── 6. Neon glow — viral edgy style ──────────────────────────────────────
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Cyan glow highlight — dark aesthetic, high energy",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "transparent",
      highlightColor: "#00F5FF",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "transparent",

      strokeWidth: 0,
      fontSize: 90,
      verticalPosition: 78,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 0,
      shadowBlur: 30,

      fontFamily: FONT_FAMILIES.rubikDirt,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0,

      animationPreset: "fade",
      lightLeakHue: 180,
      lightLeakSeed: 4,
    },
  },

  // ── 7. Slide-up storytelling style ──────────────────────────────────────
  {
    id: "storyteller",
    name: "Storyteller",
    description: "Slide-up entrance, orange highlight — warm & narrative",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#2a1a00",
      highlightColor: "#FF7A00",
      highlightStrokeColor: "#2a1a00",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 90,
      verticalPosition: 82,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 3,
      shadowOffsetY: 5,
      shadowBlur: 14,

      fontFamily: FONT_FAMILIES.permanentMarker,
      fontWeight: "800",
      textTransform: "none",
      letterSpacing: 0,

      animationPreset: "slide-up",
      lightLeakHue: 30,
      lightLeakSeed: 5,
    },
  },
];
