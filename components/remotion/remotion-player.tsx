"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { useState } from "react";
import { ShortsVideo } from "@/types";

export default function RemotionPlayer({
  videoData,
}: {
  videoData: ShortsVideo;
}) {
  return (
    <div>
      <Player
        className="border-border rounded-xl bg-neutral-300"
        component={RemotionComposition}
        durationInFrames={
          videoData?.duration ? Math.ceil(videoData?.duration * 30) : 200
        }
        compositionWidth={1080}
        compositionHeight={1920}
        fps={30}
        controls
        style={{
          // width: "vw",
          height: "55vh",
          // aspectRatio: "9/16",
        }}
        inputProps={{
          videoData,
          durationInFrames: Math.ceil(videoData?.duration! * 30),
        }}
      />
    </div>
  );
}
