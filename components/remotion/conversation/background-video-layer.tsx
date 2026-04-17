// components/remotion/conversation/background-video-layer.tsx
import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill } from "remotion";

interface BackgroundVideoLayerProps {
  backgroundVideoUrl: string;
}

/**
 * Renders a full-frame looping, muted background video.
 * `loop` is a built-in prop on @remotion/media's <Video> component.
 * The video is muted so we can layer the dialogue audio separately.
 */
export const BackgroundVideoLayer: React.FC<BackgroundVideoLayerProps> = ({
  backgroundVideoUrl,
}) => {
  return (
    <AbsoluteFill>
      <Video
        src={backgroundVideoUrl}
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};
