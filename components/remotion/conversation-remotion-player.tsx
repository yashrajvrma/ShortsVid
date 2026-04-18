"use client";

import { Player } from "@remotion/player";
import ConversationComposition from "./conversation/conversation-composition";
import { ConversationVideo } from "@/types";

export default function ConversationRemotionPlayer({
  videoData,
}: {
  videoData: ConversationVideo;
}) {
  const durationInFrames = videoData.duration
    ? Math.ceil(videoData.duration * 30)
    : 1;

  return (
    <div className="aspect-9/16 h-[60vh] overflow-hidden rounded-3xl bg-black">
      <Player
        component={ConversationComposition}
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
