import { CaptionStyle } from "@/components/remotion/caption-types";
import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type GetAllShortsOutput = RouterOutputs["videos"]["getAllShorts"];
export type AllShorts = GetAllShortsOutput[number];

export type ShortsVideo = {
  id: string;
  duration: number;
  thumbnailR2ObjectKey: string | null;
  imagesUrl: string[];
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  caption: JSON | null;
  captionConfig: CaptionStyle | null;
};

export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export type VideoStyle = {
  id: number | string;
  name?: string;
  label: string;
  thumbnail: string;
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
