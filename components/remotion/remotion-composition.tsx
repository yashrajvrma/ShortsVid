import { ShortsVideo } from "@/types";
import { useEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

interface CaptionWord {
  word: string;
  start: number;
  end: number;
}

interface CaptionData {
  words: CaptionWord[];
  duration: number;
}

export default function RemotionComposition({
  videoData,
  durationInFrames,
}: {
  videoData: ShortsVideo;
  durationInFrames: number;
}) {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();

  const captionData = videoData.caption as CaptionData | null;
  const captionConfig = videoData.captionConfig;

  // const durationInFrames = useMemo(() => {
  //   if (!captionData?.duration) return 0;
  //   return Math.ceil(captionData.duration * fps);
  // }, [captionData?.duration, fps]);

  // useEffect(() => {
  //   if (durationInFrames > 0) {
  //     setDurationInFrames(durationInFrames);
  //   }
  // }, [durationInFrames]);

  const currentCaptionWords = useMemo(() => {
    if (!captionData?.words) return [];
    const currentTime = frame / fps;
    return captionData.words.filter(
      (word) => currentTime >= word.start && currentTime <= word.end,
    );
  }, [captionData?.words, frame, fps]);

  const imagesList = videoData.imagesUrl;

  return (
    <div>
      {/* Images layer */}
      <AbsoluteFill>
        {imagesList.map((image, index) => {
          const startFrame = (index * durationInFrames) / imagesList.length;
          const segmentDuration = durationInFrames / imagesList.length;

          const scale = interpolate(
            frame,
            [
              startFrame,
              startFrame + segmentDuration / 2,
              startFrame + segmentDuration,
            ],
            index % 2 === 0 ? [1, 1.2, 1] : [1.2, 1, 1.2],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <Sequence
              key={index}
              from={startFrame}
              durationInFrames={segmentDuration}
            >
              <AbsoluteFill>
                <Img
                  src={image}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: `scale(${scale})`,
                  }}
                />
              </AbsoluteFill>
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Caption overlay — pinned to bottom */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 100,
        }}
      >
        {currentCaptionWords.length > 0 && (
          <div
            style={{
              backgroundColor:
                captionConfig?.backgroundColor ?? "rgba(0,0,0,0.6)",
              borderRadius: 8,
              padding: "6px 20px",
              maxWidth: "85%",
              textAlign: "center",
              // Stroke effect via text-shadow layers
              // WebkitTextStroke: captionConfig
              //   ? `${captionConfig.strokeWidth}px ${captionConfig.strokeColor}`
              //   : "1px rgba(0,0,0,0.8)",
            }}
          >
            <span
              style={{
                textDecorationColor: captionConfig?.textColor ?? "white",
                fontSize: captionConfig?.fontSize ?? 36,
                fontFamily: captionConfig?.fontType ?? "sans-serif",
                fontWeight: "bold",
                textShadow: captionConfig
                  ? `0 2px 6px ${captionConfig.strokeColor}`
                  : "0 2px 4px rgba(0,0,0,0.8)",
                lineHeight: 1.3,
              }}
            >
              {currentCaptionWords.map((word, i) => (
                <span
                  key={i}
                  style={{
                    // Highlight the most recent (last) word in the group
                    color:
                      i === currentCaptionWords.length - 1 &&
                      captionConfig?.textColor
                        ? captionConfig.textColor
                        : (captionConfig?.highlightColor ?? "white"),
                  }}
                >
                  {word.word}
                  {i < currentCaptionWords.length - 1 ? " " : ""}
                </span>
              ))}
            </span>
          </div>
        )}
      </AbsoluteFill>

      {videoData?.audioUrl && <Html5Audio src={videoData.audioUrl} />}
    </div>
  );
}
