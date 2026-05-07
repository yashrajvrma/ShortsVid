import { AppRouter } from "@/trpc/routers/_app";
import { Prisma } from "@prisma/client";
import { inferRouterOutputs } from "@trpc/server";
import type { LucideIcon } from "lucide-react";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type GetAllShortsOutput = RouterOutputs["videos"]["getAllShorts"];
export type AllShorts = GetAllShortsOutput[number];

export type GetShortsByIdOutput = RouterOutputs["videos"]["getShortsById"];

export type ShortsVideo = {
  id: string;
  duration: number;
  imagesUrl: string[];
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  caption: Prisma.JsonValue | null;
  captionConfig: CaptionStyle | null;
};

export type ConversationVideo = {
  id: string;
  duration: number | null;
  /** Signed URL for the combined dialogue audio (both speakers, sequential) */
  audioUrl: string | null;
  /** Signed URL for the looping background video */
  backgroundVideoUrl: string | null;
  /** Signed URL for optional background music */
  backgroundMusicUrl: string | null;
  /** Signed URL for Speaker 1's PNG avatar */
  speaker1AvatarUrl: string;
  /** Signed URL for Speaker 2's PNG avatar */
  speaker2AvatarUrl: string;
  /** Flat word-level caption — same structure as faceless video */
  caption: Prisma.JsonValue | null;
  captionConfig: CaptionStyle | null;
  /** Script lines in order. Even index (0,2,4…) = Speaker 1; Odd (1,3,5…) = Speaker 2 */
  script: {
    content: string[];
  };
};

export type VideoDetail = {
  id: string;
  status: VideoStatus;
  videoStyle: VideoStyle;
  duration: number | null;
  script: {
    id: string;
    languageCode: string;
    topic: Topic;
    prompt: string | null;
    content: string[];
  };
  voice: {
    id: string;
    name: string;
    gender: string;
    languageCode: string[];
  } | null;
  caption: Prisma.JsonValue | null;
  captionConfig: CaptionStyle | null;
  imagesUrl: string[];
  audioUrl: string | null;
  videoUrl: string | null;
  backgroundMusicUrl: string | null;
  createdAt: Date;
};

// export type ShortsVideo = Pick<
//   GetShortsByIdOutput,
//   | "id"
//   | "duration"
//   | "imagesUrl"
//   | "audioUrl"
//   | "backgroundMusicUrl"
//   | "caption"
//   | "captionConfig"
// >;

export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export interface Duration {
  id: number | string;
  value: number;
  label: string;
}

export interface GenerateScriptRequest {
  languageCode: string;
  topic: string;
  duration: number;
  prompt?: string;
}

export interface GenerateScriptResponse {
  success: boolean;
  script: string;
  scriptId?: string;
}

export interface GenerateVideoRequest {
  languageCode: string;
  topic: string;
  duration: number;
  script: string;
  voiceId: string | null;
  musicId: string | null;
  videoStyle: string;
  captionConfig: CaptionStyle;
}

// caption types

export type TextTransform = "uppercase" | "lowercase" | "capitalize" | "none";

export type AnimationPreset = "pop" | "fade" | "slide" | "none";

export interface CaptionPreset {
  id: string;
  name: string;
  /** Short description shown in the template card */
  description: string;
  style: CaptionStyle;
}

export interface CaptionStyle {
  textColor: string;
  strokeColor: string;
  highlightColor: string;
  highlightStrokeColor: string;
  popBackgroundColor: string;
  strokeWidth: number;
  fontSize: number;
  verticalPosition: number;
  horizontalPosition: number;
  maxLines: number;
  maxWordsPerLine: number;
  shadowOffsetY: number;
  shadowBlur: number;
  fontFamily: string;
  fontWeight: string;
  textTransform: TextTransform;
  letterSpacing: number;
  animationPreset: AnimationPreset;
  lightLeakHue: number;
  lightLeakSeed: number;
}

// custom types
export type VideoStatus =
  | "GENERATING"
  | "RENDERING"
  | "READY"
  | "SUCCESS"
  | "FAILED";

export type Topic =
  | "MOTIVATIONAL"
  | "HORROR_STORY"
  | "HISTORY_FACTS"
  | "PHILOSOPHY"
  | "STORYTELLING"
  | "MYSTERY_STORY"
  | "LIFE_HACKS"
  | "ANY_TOPIC";

export type VideoStyle =
  | "PHOTO_REALISTIC"
  | "CARTOON"
  | "ANIME"
  | "CYBERPUNK"
  | "CINEMATIC"
  | "PIXEL_ART"
  | "COLORFUL_COMICS";

// blog types
export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage: string;
  author: string;
  authorImage?: string;
  readingTime: string;
  published: boolean;
};

export type Blog = BlogMeta & { content: string };

// tools page type
export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  live: boolean;
  badge?: string;
  href: string;
  iconColor: string;
  iconBg: string;
};
