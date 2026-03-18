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
    <Player
      className="rounded-xl border-border bg-neutral-300 hover:cursor-pointer"
      component={RemotionComposition}
      durationInFrames={durationInFrames}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      controls
      style={{ height: "60vh", width: "auto" }}
      inputProps={{ videoData, durationInFrames }}
    />
  );
}
