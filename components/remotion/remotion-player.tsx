"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { ShortsVideo } from "@/types";

export default function RemotionPlayer({
  videoData,
}: {
  videoData: ShortsVideo;
}) {
  const durationInFrames = videoData.duration
    ? Math.ceil(videoData.duration * 30)
    : 1;

  return (
    <div className="aspect-9/16 h-[60vh] overflow-hidden rounded-3xl bg-black">
      <Player
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={1080}
        compositionHeight={1920}
        fps={30}
        controls
        style={{ width: "100%", height: "100%" }}
        inputProps={{ videoData, durationInFrames }}
        acknowledgeRemotionLicense
      />
    </div>
  );
}
