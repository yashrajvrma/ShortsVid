"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { useState } from "react";
import { ShortsVideo } from "@/types";

// TODO : add the correct types for videoData from trpc router
export default function RemotionPlayer({
  videoData,
}: {
  videoData: ShortsVideo;
}) {
  const [durationInFrames, setDurationInFrames] = useState<number>(100);

  return (
    <div>
      <Player
        className="border-border rounded-xl bg-red-400"
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={1080}
        compositionHeight={1920}
        fps={30}
        controls
        style={{
          width: "25vw",
          height: "55vh",
          // aspectRatio: "9/16",
        }}
        inputProps={{
          videoData,
          setDurationInFrames: (duration: number) =>
            setDurationInFrames(duration),
        }}
      />
    </div>
  );
}
