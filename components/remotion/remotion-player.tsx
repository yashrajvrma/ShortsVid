"use client";

import { Player } from "@remotion/player";
import RemotionComposition from "./remotion-composition";
import { ShortsVideo } from "@/types";
import { useRouter } from "next/navigation";

export default function RemotionPlayer({
  videoData,
}: {
  videoData: ShortsVideo;
}) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/app/shorts/${videoData.id}`);
  };

  return (
    <div onClick={handleClick}>
      <Player
        className="border-border rounded-xl bg-neutral-300 hover:cursor-pointer"
        component={RemotionComposition}
        durationInFrames={
          videoData?.duration ? Math.ceil(videoData?.duration * 30) : 1
        }
        compositionWidth={1080}
        compositionHeight={1920}
        fps={30}
        // controls
        style={{
          height: "40vh",
          // height: "55vh",
          // aspectRatio: "9/16",
        }}
        inputProps={{
          videoData,
          durationInFrames: videoData?.duration
            ? Math.ceil(videoData?.duration * 30)
            : 1,
        }}
      />
    </div>
  );
}
