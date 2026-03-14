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
  return (
    <div>
      <Player
        className="border-border rounded-xl bg-red-400"
        component={RemotionComposition}
        durationInFrames={
          videoData?.duration ? Math.ceil(videoData?.duration * 30) : 200
        }
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
          durationInFrames: Math.ceil(videoData?.duration! * 30),
        }}
      />
    </div>
  );
}
