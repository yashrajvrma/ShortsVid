// components\remotion\remotion-player.tsx
"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { ShortsVideo } from "@/types";
import { cn } from "@/lib/utils";

export default function RemotionPlayer({
  videoData,
  className,
}: {
  videoData: ShortsVideo;
  className?: string;
}) {
  const durationInFrames = videoData.duration
    ? Math.ceil(videoData.duration * 30)
    : 1;

  return (
    <div
      // className="aspect-9/16 h-[60vh] overflow-hidden rounded-3xl bg-black"
      className={cn(
        "aspect-[9/16] h-[60vh] overflow-hidden rounded-3xl bg-black",
        className,
      )}
    >
      <Player
        component={RemotionComposition}
        durationInFrames={durationInFrames}
        compositionWidth={1080}
        compositionHeight={1920}
        fps={30}
        controls
        style={{ width: "100%", height: "100%" }}
        inputProps={{ videoData, durationInFrames }}
        acknowledgeRemotionLicense={true}
      />
    </div>
  );
}
