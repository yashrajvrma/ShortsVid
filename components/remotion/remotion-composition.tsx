import { AbsoluteFill, useVideoConfig } from "remotion";

//  TODO : fix the types for videoData with trpx router
export default function RemotionComposition({
  videoData,
  setDurationInFrames,
}: {
  videoData: any;
  setDurationInFrames: (duration: number) => void;
}) {
  const { fps } = useVideoConfig();

  // 1.  get video duration from videoData and pass it to durationInFrames
  const durationInFrames = Math.ceil(videoData.duration * fps);

  setDurationInFrames(durationInFrames);

  return (
    <div>
      <AbsoluteFill></AbsoluteFill>
    </div>
  );
}
