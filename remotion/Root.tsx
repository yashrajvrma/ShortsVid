// remotion\Root.tsx
//
// ALL compositions are registered here — Remotion bundles everything once.
// Server-side rendering picks the right composition via compositionId:
//   "renderVideo"             → faceless / AI-image shorts
//   "renderConversationVideo" → dual-speaker conversation videos

import React from "react";
import RemotionComposition from "../components/remotion/remotion-composition";
import ConversationVideoComposition from "../components/remotion/conversation/conversation-composition";
import { Composition, CalculateMetadataFunction } from "remotion";
import { ShortsVideo, ConversationVideo } from "../types";

// ─── Faceless video props type ────────────────────────────────────────────────
type FacelessRootProps = {
  videoData: ShortsVideo;
};

// ─── Conversation video props type ───────────────────────────────────────────
type ConversationRootProps = {
  videoData: ConversationVideo;
};

const videoData = {
  id: "cmp5fn50v000450l9942tdpgh",
  status: "SUCCESS",
  videoStyle: "COMIC",
  duration: 49,
  script: {
    id: "cmp5fn4mn000250l985k91n8b",
    languageCode: "en",
    topic: "MYSTERY_STORY",
    prompt: "a detective criminal story",
    content: [
      "A dark alley. Rain-soaked pavement glimmers under the flickering streetlight.",
      "Detective Sarah Hart stands over a lifeless body, her mind racing.",
      "A cryptic note clutches in the victim's hand — a riddle leading to the truth.",
      "She eyes the shadows, feeling the weight of a killer watching her.",
      "Each clue pulls her deeper into a web of deceit.",
      "The clock ticks. With every second, the killer slips further away.",
      "A whispered name echoes in her head — the city's most notorious crime lord.",
      "In a hidden lair, she confronts him, the pieces finally clicking into place.",
      "But as she draws her weapon, he smiles, revealing an unexpected ally.",
      "Betrayal cuts deeper than any knife. The real game is just beginning.",
      "Sarah realizes the only way out is to play their dangerous game.",
    ],
  },
  voice: {
    id: "cmmib8gh10005dcl9fs7jjnba",
    name: "Adrian",
    gender: "male",
    languageCode: ["en"],
  },
  captionConfig: {
    id: "cmp5fn4tn000350l95t14ba4m",
    name: null,
    textColor: "#FFFFFF",
    strokeColor: "#000000",
    highlightColor: "#FFFFFF",
    highlightStrokeColor: "transparent",
    popBackgroundColor: "#6C3CF7",
    strokeWidth: 0.5,
    fontSize: 70,
    verticalPosition: 50,
    horizontalPosition: 50,
    maxLines: 2,
    maxWordsPerLine: 2,
    shadowOffsetY: 0,
    shadowBlur: 0,
    fontFamily: "Montserrat",
    fontWeight: "800",
    textTransform: "none",
    letterSpacing: -2,
    animationPreset: "pop",
    lightLeakHue: 240,
    lightLeakSeed: 3,
    createdAt: "2026-05-14T11:56:12.970Z",
    updatedAt: "2026-05-14T11:56:12.970Z",
  },
  caption: {
    words: [
      { end: 0.41999998688697815, word: "A", start: 0 },
      { end: 0.6800000071525574, word: "dark", start: 0.41999998688697815 },
      { end: 1.0399999618530273, word: "alley", start: 0.6800000071525574 },
    ],
    duration: 48.20000076293945,
  },
  imagesUrl: [],
  audioUrl: "",
  videoUrl: "",
  backgroundMusicUrl: null,
  createdAt: "2026-05-14T11:56:13.231Z",
  updatedAt: "2026-05-17T12:07:36.860Z",
};

// ─── calculateMetadata: Faceless ─────────────────────────────────────────────
// ⚠️ CRITICAL: Must return `props` so Lambda uses the real render-time videoData
// instead of the hardcoded defaultProps above.
// Duration comes from the caption data's last word end-time (most accurate)
// or falls back to the video.duration stored in DB.

const calculateFacelessMetadata: CalculateMetadataFunction<
  FacelessRootProps
> = ({ props }) => {
  const caption = props.videoData?.caption as {
    words?: { end: number }[];
    duration?: number;
  } | null;
  const captionDuration =
    caption?.duration ??
    (caption?.words?.length
      ? caption.words[caption.words.length - 1].end
      : null);
  const duration = captionDuration ?? props.videoData?.duration ?? 60;
  return {
    durationInFrames: Math.ceil(duration * 30),
    props, // ← CRITICAL: passes real videoData from Lambda render call through
  };
};

// ─── calculateMetadata: Conversation ─────────────────────────────────────────
// Same strategy: use last word's end-time from the flat caption words array.

const calculateConversationMetadata: CalculateMetadataFunction<
  ConversationRootProps
> = ({ props }) => {
  const caption = props.videoData?.caption as {
    words?: { end: number }[];
    duration?: number;
  } | null;
  const captionDuration =
    caption?.duration ??
    (caption?.words?.length
      ? caption.words[caption.words.length - 1].end
      : null);
  const duration = captionDuration ?? props.videoData?.duration ?? 60;
  return {
    durationInFrames: Math.ceil(duration * 30),
    props, // ← CRITICAL: passes real videoData from Lambda render call through
  };
};

// ─── Dev defaultProps: Conversation video ─────────────────────────────────────
// These are used only in Remotion Studio preview. Replace URLs with fresh
// signed URLs when testing; they expire after 1 hour.

const conversationVideoData: ConversationVideo = {
  id: "cmo2ywxby000204l9d5gioggz",
  duration: 64,
  script: {
    content: [
      "Hey, uh, SpongeBob, I've been hearin' all this buzz about 'React.' What is it, some new dance move I should know about?",
      "Oh, Peter, it's not a dance! React is this amazing JavaScript library! It helps you build cool, interactive user interfaces. Perfect for organizing your thoughts, almost like putting jellyfish in a perfect line.",
      "Ah, gotcha! So, it's like, I can use it to make those menus at the Drunken Clam dance across the screen or something?",
      "Exactly! You can make your menus appear, disappear, and even do backflips if you want! It's all about rendering efficiently and keeping things fresh.",
      "Wow, I've been rendering efficiently by just finding the remote faster, but this sounds more impressive. Does it help with, uh, say, keeping track of TV shows I've binged?",
      "Totally! You could create a nifty tracker. Each time you watch, React can update your list instantly without reloading the whole page. It's magic, really.",
      "Geez, with all these options, I might become a tech wizard in my own right. Can I build a virtual Quahog with it?",
      "Haha, you sure can! Add a few more tools with React, and you've got yourself a bustling digital metropolis. The possibilities are as endless as a Krabby Patty's flavor combinations!",
    ],
  },
  captionConfig: {
    textColor: "#FFFFFF",
    strokeColor: "#000000",
    highlightColor: "#FFFFFF",
    highlightStrokeColor: "transparent",
    popBackgroundColor: "#6C3CF7",
    strokeWidth: 0.5,
    fontSize: 85,
    verticalPosition: 53,
    horizontalPosition: 50,
    maxLines: 2,
    maxWordsPerLine: 2,
    shadowOffsetY: 0,
    shadowBlur: 0,
    fontFamily: "Montserrat",
    fontWeight: "800",
    textTransform: "none",
    letterSpacing: 0,
    animationPreset: "pop",
    lightLeakHue: 240,
    lightLeakSeed: 3,
  },
  caption: {
    words: [
      { end: 0.4000000059604645, word: "Hey", start: 0 },
      { end: 0.9599999785423279, word: "uh", start: 0.47999998927116394 },
    ],
    duration: 63.099998474121094,
  },
  speaker1AvatarUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/avatar/system/cmo00at0p000iaol9i2vrztfo?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=340ef0eddd5f923950f72edf2fd6a3b33dfe5663034fd358335d16ab10b1c2e1&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  speaker2AvatarUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/avatar/system/cmo00au65000jaol9vv6f8ckz?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=4cfc9c5f19833497943b71e4d0fe16e4d9ab97847eeb38eede54a0d64d1ff2cd&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  audioUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/shorts/cmo2ywxby000204l9d5gioggz/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=64301e45ad34ef9f639e0d57bcb8810b03c500832769c67f491c55b80a06e445&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  backgroundVideoUrl:
    "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/stock/video/system/cmnz9ds7b0009eol9r5j3v062?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=efb97de48b7849b936f38e8a5a31241a%2F20260417%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260417T184624Z&X-Amz-Expires=3600&X-Amz-Signature=b7bc6ceca73831dad48db45883542ba83233774021b63e72e7441b9c685a118b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
  backgroundMusicUrl: null,
};

// ─── Root ─────────────────────────────────────────────────────────────────────

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Faceless AI-image shorts ── */}
      <Composition
        id="renderVideo"
        component={RemotionComposition}
        durationInFrames={1800} // placeholder — overridden by calculateMetadata
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          // @ts-ignore
          videoData: videoData,
        }}
        calculateMetadata={calculateFacelessMetadata}
      />

      {/* ── Dual-speaker conversation videos ── */}
      <Composition
        id="renderConversationVideo"
        component={ConversationVideoComposition}
        durationInFrames={1800} // placeholder — overridden by calculateMetadata
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          videoData: conversationVideoData,
        }}
        calculateMetadata={calculateConversationMetadata}
      />
    </>
  );
};
