// // components/remotion/fonts.ts
// import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
// import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
// import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
// import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
// import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
// import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
// import { loadFont as loadRubikDirt } from "@remotion/google-fonts/RubikDirt";
// import { loadFont as loadCustomFont } from "@remotion/fonts";
// import { staticFile, delayRender, continueRender } from "remotion";

// // ── Google Fonts — register synchronously ─────────────────────────────────────
// const bangersFont = loadBangers("normal", {
//   weights: ["400"],
//   subsets: ["latin"],
// });
// const montserratFont = loadMontserrat("normal", {
//   weights: ["700", "800", "900"],
//   subsets: ["latin"],
// });
// const oswaldFont = loadOswald("normal", {
//   weights: ["600", "700"],
//   subsets: ["latin"],
// });
// const permanentMarkerFont = loadPermanentMarker("normal", {
//   weights: ["400"],
//   subsets: ["latin"],
// });
// const interFont = loadInter("normal", {
//   weights: ["300", "400", "700"],
//   subsets: ["latin"],
// });
// const bebasNeueFont = loadBebasNeue("normal", {
//   weights: ["400"],
//   subsets: ["latin"],
// });
// const rubikDirtFont = loadRubikDirt("normal", {
//   weights: ["400"],
//   subsets: ["latin"],
// });

// // ── Block Remotion's render pipeline until ALL fonts are ready ────────────────
// // delayRender/continueRender is the only mechanism that reliably works
// // in Lambda — top-level await is NOT guaranteed to block Lambda's renderer.
// const fontHandle = delayRender("Loading fonts");

// Promise.all([
//   // Google fonts
//   bangersFont.waitUntilDone(),
//   montserratFont.waitUntilDone(),
//   oswaldFont.waitUntilDone(),
//   permanentMarkerFont.waitUntilDone(),
//   interFont.waitUntilDone(),
//   bebasNeueFont.waitUntilDone(),
//   rubikDirtFont.waitUntilDone(),
//   // Local font — loadCustomFont() returns a Promise, must be awaited too
//   loadCustomFont({
//     family: "komikaAxis",
//     url: staticFile("fonts/komikaAxis.woff2"),
//     weight: "700",
//     style: "normal",
//   }),
// ])
//   .then(() => {
//     continueRender(fontHandle);
//   })
//   .catch((err) => {
//     // Don't silently swallow — Remotion will surface this as a render error
//     continueRender(fontHandle);
//     console.error("Font loading failed:", err);
//   });

// // ─── Font family strings ──────────────────────────────────────────────────────
// export const FONT_FAMILIES = {
//   bangers: bangersFont.fontFamily,
//   montserrat: montserratFont.fontFamily,
//   oswald: oswaldFont.fontFamily,
//   permanentMarker: permanentMarkerFont.fontFamily,
//   inter: interFont.fontFamily,
//   bebasNeue: bebasNeueFont.fontFamily,
//   rubikDirt: rubikDirtFont.fontFamily,
//   komikaAxis: "komikaAxis",
// } as const;

// export type FontKey = keyof typeof FONT_FAMILIES;

// components/remotion/fonts.ts
import { loadFont as loadBangers } from "@remotion/google-fonts/Bangers";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadPermanentMarker } from "@remotion/google-fonts/PermanentMarker";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadBebasNeue } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadRubikDirt } from "@remotion/google-fonts/RubikDirt";
import { continueRender, delayRender, staticFile } from "remotion";

// ── Google Fonts — register synchronously ─────────────────────────────────────
const bangersFont = loadBangers("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const montserratFont = loadMontserrat("normal", {
  weights: ["700", "800", "900"],
  subsets: ["latin"],
});
const oswaldFont = loadOswald("normal", {
  weights: ["600", "700"],
  subsets: ["latin"],
});
const permanentMarkerFont = loadPermanentMarker("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const interFont = loadInter("normal", {
  weights: ["300", "400", "700"],
  subsets: ["latin"],
});
const bebasNeueFont = loadBebasNeue("normal", {
  weights: ["400"],
  subsets: ["latin"],
});
const rubikDirtFont = loadRubikDirt("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

// ── Block Remotion render pipeline until all Google Fonts are ready ───────────
const fontHandle = delayRender("Loading Google Fonts");

Promise.all([
  bangersFont.waitUntilDone(),
  montserratFont.waitUntilDone(),
  oswaldFont.waitUntilDone(),
  permanentMarkerFont.waitUntilDone(),
  interFont.waitUntilDone(),
  bebasNeueFont.waitUntilDone(),
  rubikDirtFont.waitUntilDone(),
])
  .then(() => {
    console.log("✅ All Google Fonts loaded");
    continueRender(fontHandle);
  })
  .catch((err) => {
    console.error("❌ Google Font loading failed:", err);
    continueRender(fontHandle);
  });

// ── Local font (komikaAxis) — loaded separately, non-blocking ─────────────────
// Loaded in isolation so a missing file or FontFace error doesn't crash
// the entire font pipeline or block Google Fonts from loading.
if (typeof FontFace !== "undefined") {
  // Only attempt in browser environments where FontFace exists
  import("@remotion/fonts")
    .then(({ loadFont: loadCustomFont }) =>
      loadCustomFont({
        family: "komikaAxis",
        url: staticFile("fonts/komikaAxis.woff2"),
        weight: "700",
        style: "normal",
      }),
    )
    .then(() => console.log("✅ komikaAxis loaded"))
    .catch((err) =>
      console.warn("⚠️ komikaAxis failed to load (non-fatal):", err),
    );
}

// ─── Font family strings ──────────────────────────────────────────────────────
export const FONT_FAMILIES = {
  bangers: bangersFont.fontFamily,
  montserrat: montserratFont.fontFamily,
  oswald: oswaldFont.fontFamily,
  permanentMarker: permanentMarkerFont.fontFamily,
  inter: interFont.fontFamily,
  bebasNeue: bebasNeueFont.fontFamily,
  rubikDirt: rubikDirtFont.fontFamily,
  komikaAxis: "komikaAxis",
} as const;

export type FontKey = keyof typeof FONT_FAMILIES;
