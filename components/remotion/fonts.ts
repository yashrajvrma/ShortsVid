"use client";

import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadRubikDirt } from "@remotion/google-fonts/RubikDirt";

import { loadFont as loadCustomFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const komikaAxisFont = loadCustomFont({
  family: "komikaAxis", // ← name you choose, used in CSS
  url: staticFile("fonts/komikaAxis.woff2"),
  weight: "700",
  style: "normal",
});

// ── Bangers — comic-book caps, great for "With Short Hair" style ──────────────
export const bangersFont = loadBangers("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Montserrat — clean & bold, great for "A lot of my clients" style ─────────
export const montserratFont = loadMontserrat("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

// ── Oswald — condensed, punchy — viral talking head style ────────────────────
export const oswaldFont = loadOswald("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

// ── Permanent Marker — hand-written energy, casual viral style ───────────────
export const permanentMarkerFont = loadPermanentMarker("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Inter — minimal, modern, great for clean captions style ──────────────────
export const interFont = loadInter("normal", {
  weights: ["300", "400", "700"],
  subsets: ["latin"],
});

// ── Bebas Neue — ultra-condensed caps, cinematic feel ────────────────────────
export const bebasNeueFont = loadBebasNeue("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Rubik Dirt — grungy / textured, edgy viral style ─────────────────────────
export const rubikDirtFont = loadRubikDirt("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ─── Font family strings (use these in caption-types.ts presets) ──────────────
//
// These are the actual CSS font-family values returned by each loadFont() call.
// Always use these variables — never hardcode the font name string directly,
// because Remotion may prefix or transform the name internally.

export const FONT_FAMILIES = {
  bangers: bangersFont.fontFamily,
  montserrat: montserratFont.fontFamily,
  oswald: oswaldFont.fontFamily,
  permanentMarker: permanentMarkerFont.fontFamily,
  inter: interFont.fontFamily,
  bebasNeue: bebasNeueFont.fontFamily,
  rubikDirt: rubikDirtFont.fontFamily,
  komikaAxis: "komikaAxis", // ← just the family name string you chose
} as const;
