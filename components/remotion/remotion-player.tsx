"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { useState } from "react";

// TODO : add the correct types for videoData from trpc router
export default function RemotionPlayer({ videoData }: { videoData: any }) {
  const [durationInFrames, setDurationInFrames] = useState<number>(0);

  return (
    <div>
      <Player
        className="aspect-9/16"
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={1080}
        compositionHeight={1080}
        fps={30}
        controls
        inputProps={{
          videoData,
          setDurationInFrames: (duration: number) =>
            setDurationInFrames(duration),
        }}
      />
    </div>
  );
}
