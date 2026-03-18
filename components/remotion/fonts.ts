// components/remotion/fonts.ts
//
// ✅ Remotion best-practice: call loadFont() at the top level of the module.
//    This file must ONLY be imported inside Remotion compositions / the
//    Remotion bundle — never from a Next.js page or shared constants file.
//    Next.js pages should import FONT_FAMILIES from `lib/font-constants.ts`
//    (a plain string map with no Remotion runtime dependency).

import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadRubikDirt } from "@remotion/google-fonts/RubikDirt";
import { loadFont as loadCustomFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// ── Local font ────────────────────────────────────────────────────────────────
// Place komikaAxis.woff2 inside your `public/fonts/` folder.
await loadCustomFont({
  family: "komikaAxis",
  url: staticFile("fonts/komikaAxis.woff2"),
  weight: "700",
  style: "normal",
});

// ── Google Fonts ──────────────────────────────────────────────────────────────
// Specify only the weights/subsets you need to keep bundle size small.

export const bangersFont = loadBangers("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const montserratFont = loadMontserrat("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});

export const oswaldFont = loadOswald("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});

export const permanentMarkerFont = loadPermanentMarker("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const interFont = loadInter("normal", {
  weights: ["300", "400", "700"],
  subsets: ["latin"],
});

export const bebasNeueFont = loadBebasNeue("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const rubikDirtFont = loadRubikDirt("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ─── Font family strings ──────────────────────────────────────────────────────
// Re-export a typed map so Remotion compositions can reference fonts by key
// without hardcoding the internal family name string.
// NOTE: keep this in sync with lib/font-constants.ts

export const FONT_FAMILIES = {
  bangers: bangersFont.fontFamily,
  montserrat: montserratFont.fontFamily,
  oswald: oswaldFont.fontFamily,
  permanentMarker: permanentMarkerFont.fontFamily,
  inter: interFont.fontFamily,
  bebasNeue: bebasNeueFont.fontFamily,
  rubikDirt: rubikDirtFont.fontFamily,
  komikaAxis: "komikaAxis", // local font — family name is what you passed to loadFont()
} as const;

export type FontKey = keyof typeof FONT_FAMILIES;
