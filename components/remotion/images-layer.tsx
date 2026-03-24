// import React from "react";
// import {
//   AbsoluteFill,
//   Audio,
//   Html5Audio,
//   Img,
//   Sequence,
//   interpolate,
//   staticFile,
//   useCurrentFrame,
//   useVideoConfig,
// } from "remotion";
// import { TransitionSeries } from "@remotion/transitions";
// import { LightLeak } from "@remotion/light-leaks";

// // ─── Tweakable constants ───────────────────────────────────────────────────────

// const LIGHT_LEAK_FRAMES = 30; // overlay duration in frames (~1 s at 30 fps)
// const LIGHT_LEAK_OPACITY = 0.7; // 0 = invisible · 1 = full intensity

// // Change to "sfx/whoosh.mp3" if you want the whoosh instead
// const SFX_SRC = staticFile("sfx/cameraflash.mp3");
// const SFX_VOLUME = 1; // 0–1

// // ─── Single Image Scene (Ken Burns zoom) ──────────────────────────────────────

// const ImageScene: React.FC<{
//   src: string;
//   index: number;
//   segmentDurationInFrames: number;
// }> = ({ src, index, segmentDurationInFrames }) => {
//   const frame = useCurrentFrame();

//   const scale = interpolate(
//     frame,
//     [0, segmentDurationInFrames],
//     index % 2 === 0 ? [1, 1.12] : [1.12, 1],
//     { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
//   );

//   return (
//     <AbsoluteFill>
//       <Img
//         src={src}
//         style={{
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//           transform: `scale(${scale})`,
//         }}
//       />
//     </AbsoluteFill>
//   );
// };

// // ─── Light Leak visual only (NO audio here) ───────────────────────────────────
// // Audio must live outside TransitionSeries at the ImagesLayer level so that
// // Remotion's timeline frame counter is stable and the sound fires correctly.

// const LightLeakOverlay: React.FC<{
//   hueShift: number;
//   seed: number;
// }> = ({ hueShift, seed }) => (
//   <div
//     style={{
//       position: "absolute",
//       inset: 0,
//       width: "100%",
//       // grayscale strips the warm hue → pure white flash
//       // brightness boosts it → feels like a real film flare
//       filter: "grayscale(1) brightness(0.8)",
//       opacity: LIGHT_LEAK_OPACITY,
//     }}
//   >
//     <LightLeak seed={seed} hueShift={hueShift} />
//   </div>
// );

// // ─── Images Layer ─────────────────────────────────────────────────────────────

// export const ImagesLayer: React.FC<{
//   imagesList: string[];
//   durationInFrames: number;
//   lightLeakHue: number;
//   lightLeakSeed: number;
// }> = ({ imagesList, durationInFrames, lightLeakHue, lightLeakSeed }) => {
//   const { fps } = useVideoConfig();

//   if (!imagesList || imagesList.length === 0) {
//     return null;
//   }

//   const segmentDuration = Math.max(
//     1,
//     Math.floor(durationInFrames / imagesList.length),
//   );

//   // Prevent transition from taking more than half the segment duration.
//   // This avoids "TransitionSeries.Overlay extends before frame 0" errors
//   // that occur when sequences are shorter than the transition duration.
//   const transitionDuration = Math.min(
//     LIGHT_LEAK_FRAMES,
//     Math.max(1, Math.floor(segmentDuration / 2)),
//   );

//   // Calculate the absolute frame at which each cut happens.
//   // TransitionSeries.Overlay does NOT shorten the timeline, so the cut frame
//   // is simply segmentDuration * index.
//   const cutFrames: number[] = imagesList
//     .slice(0, -1) // one cut per gap between scenes
//     .map((_, i) => segmentDuration * (i + 1));

//   return (
//     <AbsoluteFill>
//       {/* ── Image scenes with light leak visuals ── */}
//       <TransitionSeries>
//         {imagesList.map((image, index) => (
//           <React.Fragment key={index}>
//             <TransitionSeries.Sequence durationInFrames={segmentDuration}>
//               <ImageScene
//                 src={image}
//                 index={index}
//                 segmentDurationInFrames={segmentDuration}
//               />
//             </TransitionSeries.Sequence>

//             {index < imagesList.length - 1 && (
//               <TransitionSeries.Overlay durationInFrames={transitionDuration}>
//                 <LightLeakOverlay
//                   hueShift={lightLeakHue}
//                   seed={(lightLeakSeed + index) % 10}
//                 />
//               </TransitionSeries.Overlay>
//             )}
//           </React.Fragment>
//         ))}
//       </TransitionSeries>

//       {/*
//         ── SFX Audio — placed OUTSIDE TransitionSeries ──────────────────────────
//         Each <Sequence> fires exactly one play of the SFX at the cut frame.
//         Placing audio here (not inside TransitionSeries.Overlay) gives Remotion
//         a stable absolute frame reference so the sound actually triggers.
//         trimAfter clips the file to LIGHT_LEAK_FRAMES so it doesn't bleed over.
//       */}
//       {cutFrames.map((cutFrame) => (
//         <Sequence
//           key={cutFrame}
//           from={cutFrame}
//           durationInFrames={transitionDuration}
//           layout="none"
//         >
//           <Html5Audio
//             src={SFX_SRC}
//             volume={SFX_VOLUME}
//             trimAfter={transitionDuration}
//           />
//         </Sequence>
//       ))}
//     </AbsoluteFill>
//   );
// };

import React from "react";
import {
  AbsoluteFill,
  Audio,
  Html5Audio,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

// ─── Tweakable constants ───────────────────────────────────────────────────────

const LIGHT_LEAK_FRAMES = 30; // overlay duration in frames (~1 s at 30 fps)
const LIGHT_LEAK_OPACITY = 0.7; // 0 = invisible · 1 = full intensity

const SFX_SRC = staticFile("sfx/cameraflash.mp3");
const SFX_VOLUME = 1; // 0–1

// ─── Single Image Scene (Ken Burns zoom) ──────────────────────────────────────

const ImageScene: React.FC<{
  src: string;
  index: number;
  segmentDurationInFrames: number;
}> = ({ src, index, segmentDurationInFrames }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, segmentDurationInFrames],
    index % 2 === 0 ? [1, 1.12] : [1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ─── Light Leak visual only (NO audio here) ───────────────────────────────────

const LightLeakOverlay: React.FC<{
  hueShift: number;
  seed: number;
}> = ({ hueShift, seed }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      width: "100%",
      filter: "grayscale(1) brightness(0.8)",
      opacity: LIGHT_LEAK_OPACITY,
    }}
  >
    <LightLeak seed={seed} hueShift={hueShift} />
  </div>
);

// ─── Images Layer ─────────────────────────────────────────────────────────────

export const ImagesLayer: React.FC<{
  imagesList: string[];
  durationInFrames: number;
  lightLeakHue: number;
  lightLeakSeed: number;
}> = ({ imagesList, durationInFrames, lightLeakHue, lightLeakSeed }) => {
  const { fps } = useVideoConfig();

  if (!imagesList || imagesList.length === 0) {
    return null;
  }

  const imageCount = imagesList.length;
  const transitionCount = imageCount - 1;

  // ── FIX: Account for TransitionSeries.Overlay overlap ──────────────────────
  // Overlay shrinks total duration by transitionDuration per cut.
  // We first estimate transitionDuration using LIGHT_LEAK_FRAMES, then solve:
  //   segmentDuration * imageCount - transitionDuration * transitionCount = durationInFrames
  //   => segmentDuration = (durationInFrames + transitionDuration * transitionCount) / imageCount
  //
  // We do one iteration: estimate transitionDuration from the raw segment,
  // then recompute segmentDuration with the corrected transitionDuration.

  const rawSegment = Math.max(1, Math.floor(durationInFrames / imageCount));

  const estimatedTransition = Math.min(
    LIGHT_LEAK_FRAMES,
    Math.max(1, Math.floor(rawSegment / 2)),
  );

  const segmentDuration = Math.max(
    1,
    Math.floor(
      (durationInFrames + estimatedTransition * transitionCount) / imageCount,
    ),
  );

  // Recompute transition duration based on corrected segment duration
  const transitionDuration = Math.min(
    LIGHT_LEAK_FRAMES,
    Math.max(1, Math.floor(segmentDuration / 2)),
  );

  // Log for debugging — remove once confirmed working
  console.log("[ImagesLayer] durationInFrames:", durationInFrames);
  console.log("[ImagesLayer] imageCount:", imageCount);
  console.log("[ImagesLayer] segmentDuration:", segmentDuration);
  console.log("[ImagesLayer] transitionDuration:", transitionDuration);
  console.log(
    "[ImagesLayer] expected total frames:",
    segmentDuration * imageCount - transitionDuration * transitionCount,
  );

  // Absolute frame at which each cut fires (for SFX audio)
  const cutFrames: number[] = imagesList
    .slice(0, -1)
    .map(
      (_, i) =>
        (segmentDuration - transitionDuration) * (i + 1) +
        transitionDuration * i,
    );
  // More precise: each sequence starts at (segmentDuration - transitionDuration) * i
  // and the cut (overlay start) is at segmentDuration - transitionDuration frames in.

  return (
    <AbsoluteFill>
      {/* ── Image scenes with light leak visuals ── */}
      <TransitionSeries>
        {imagesList.map((image, index) => (
          <React.Fragment key={index}>
            <TransitionSeries.Sequence durationInFrames={segmentDuration}>
              <ImageScene
                src={image}
                index={index}
                segmentDurationInFrames={segmentDuration}
              />
            </TransitionSeries.Sequence>

            {index < imagesList.length - 1 && (
              <TransitionSeries.Overlay durationInFrames={transitionDuration}>
                <LightLeakOverlay
                  hueShift={lightLeakHue}
                  seed={(lightLeakSeed + index) % 10}
                />
              </TransitionSeries.Overlay>
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/*
        ── SFX Audio — placed OUTSIDE TransitionSeries ──────────────────────────
        Each <Sequence> fires exactly one play of the SFX at the cut frame.
      */}
      {cutFrames.map((cutFrame) => (
        <Sequence
          key={cutFrame}
          from={cutFrame}
          durationInFrames={transitionDuration}
          layout="none"
        >
          <Html5Audio
            src={SFX_SRC}
            volume={SFX_VOLUME}
            trimAfter={transitionDuration}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
