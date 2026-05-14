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
  // | "PHOTO_REALISTIC"
  // | "CARTOON"
  // | "PIXEL_ART"
  // | "COLORFUL_COMICS"
  // TODO: remove and format this newly added styles
  | "COMIC"
  | "PIXAR"
  | "ANIME"
  | "CYBERPUNK"
  | "CINEMATIC"
  | "MANGA"
  | "ILLUSTRATION"
  | "CARTOON_3D";

// ─── Style config ──────────────────────────────────────────────────────────────

export interface StyleConfig {
  label: string; // human-readable label for UI
  mainPrompt: string; // appended after scene description
  negativePrompt: string; // passed to image generation API
}

export const VIDEO_STYLE_CONFIG: Record<VideoStyle, StyleConfig> = {
  // PHOTO_REALISTIC: {
  //   label: "",
  //   mainPrompt: "",
  //   negativePrompt: "",
  // },
  // CARTOON: {
  //   label: "",
  //   mainPrompt: "",
  //   negativePrompt: "",
  // },
  // PIXEL_ART: {
  //   label: "",
  //   mainPrompt: "",
  //   negativePrompt: "",
  // },
  // COLORFUL_COMICS: {
  //   label: "",
  //   mainPrompt: "",
  //   negativePrompt: "",
  // },
  COMIC: {
    label: "Comic",
    mainPrompt:
      "dark cinematic adult comic illustration, gritty western animated graphic novel style, mature thriller storyboard, noir crime atmosphere, deep shadows, low-key lighting, underexposed cinematic frame, moody blue-black color palette, subtle practical lighting, dramatic perspective, suspenseful storytelling composition, bold black ink outlines, rough cel-shaded rendering, detailed skin shading, expressive facial anatomy, exaggerated emotions, raw comic textures, imperfect ink strokes, cinematic framing, shadow-heavy environment, desaturated colors, realistic tension in body language, film noir lighting, same universe, same comic series, same storyboard art direction, vertical mobile frame",
    negativePrompt:
      "bright lighting, colorful, vibrant colors, superhero comic style, clean polished artwork, glossy skin, beauty lighting, overexposed, studio lighting, anime, disney, pixar, manga, realistic photography, 3d render, soft shadows, cheerful mood, cute style, pastel colors, blurry, unreadable text, broken letters, watermark, extra limbs, bad hands, distorted anatomy",
  },

  PIXAR: {
    label: "Pixar",
    mainPrompt:
      "cinematic 3D Pixar/Disney-style animated scene, modern animated movie aesthetic, highly expressive stylized characters, emotional storytelling composition, ultra detailed 3D render, soft cinematic lighting, warm global illumination, smooth realistic skin shading, subtle subsurface scattering, detailed hair strands, realistic fabric folds, expressive eyes, cozy cinematic atmosphere, shallow depth of field, volumetric lighting, octane render quality, realistic bounce lighting, polished feature-film look, soft ambient shadows, cinematic color grading, clean textures, highly detailed environment, stylized but believable proportions, animated short-film aesthetic, masterpiece quality, vertical 9:16 composition",
    negativePrompt:
      "blurry, low quality, distorted face, bad anatomy, extra fingers, deformed hands, duplicate limbs, noisy render, oversaturated colors, realistic photography, anime, sketch, flat lighting, messy composition, cropped subject, unreadable text, broken letters, warped typography, watermark",
  },

  ANIME: {
    label: "Anime",
    mainPrompt:
      "cinematic anime scene, beautiful modern anime art style, highly detailed anime character design, expressive eyes, clean line art, soft cinematic shading, atmospheric lighting, detailed background environment, emotional storytelling composition, vibrant yet natural colors, studio-quality anime frame, movie-like composition, dramatic lighting, depth of field, volumetric light rays, polished anime movie aesthetic, ultra detailed illustration, dynamic perspective, subtle film grain, hand-drawn anime look, detailed clothing folds, detailed hair strands, immersive environment, anime film still, high quality cel shading, soft glow effects, masterpiece anime artwork, vertical 9:16 composition",
    negativePrompt:
      "blurry, low quality, bad anatomy, distorted face, extra fingers, deformed hands, poorly drawn eyes, messy line art, oversaturated colors, flat lighting, realistic photography, 3D render, CGI, low detail background, cropped subject, unreadable text, broken typography, watermark",
  },

  CYBERPUNK: {
    label: "Cyberpunk",
    mainPrompt:
      "cinematic cyberpunk illustration, futuristic neon-noir city aesthetic, high-tech dystopian atmosphere, glowing holograms, rainy streets, dense urban environment, neon signage reflections, moody cinematic lighting, deep shadows, vibrant cyan-magenta color palette, atmospheric fog, volumetric lighting, futuristic architecture, detailed sci-fi environment, stylized cinematic composition, dramatic perspective, glowing screens, techwear fashion, reflective wet surfaces, electric blue and pink neon glow, gritty futuristic storytelling, anime-inspired western cyberpunk art style, ultra detailed digital painting, sharp focus, dynamic framing, layered depth, immersive worldbuilding, cinematic sci-fi movie still, high detail, vertical mobile frame",
    negativePrompt:
      "low quality, blurry, washed out colors, flat lighting, daylight scene, medieval, fantasy, rural environment, cartoon kids style, cheerful atmosphere, pastel palette, overexposed highlights, realistic photography, bad anatomy, distorted face, extra limbs, malformed hands, low detail, muddy textures, empty background, boring composition, watermark, unreadable text, oversaturated neon, ugly characters, poor perspective, low resolution, 3d game render",
  },

  CINEMATIC: {
    label: "Cinematic",
    mainPrompt:
      "ultra cinematic historical portrait, realistic cinematic photography style, epic ancient empire aesthetic, powerful historical figure standing confidently, dramatic composition, movie-poster quality, highly detailed face, realistic skin texture, sharp eyes, intricate traditional royal clothing, ornate armor details, majestic robes, cinematic warm lighting, deep shadows, moody atmosphere, volumetric lighting, ultra realistic fabric textures, dramatic contrast, shallow depth of field, cinematic color grading, realistic beard and hair details, intense expression, powerful ruler aura, premium Netflix historical drama aesthetic, ultra detailed realism, masterpiece quality, realistic photography, professional movie still, dynamic lighting, soft atmospheric particles, 8k detail, vertical 9:16 composition",
    negativePrompt:
      "blurry, low quality, cartoon, anime, CGI, 3D render, bad anatomy, distorted face, extra fingers, deformed hands, oversaturated colors, flat lighting, low detail clothing, unrealistic proportions, messy composition, unreadable text, watermark",
  },

  MANGA: {
    label: "Manga",
    mainPrompt:
      "Japanese manga style, black and white manga aesthetic, screentone shading with hatching textures, thick clean ink lines, high contrast, shonen or seinen manga art, hand-drawn digital ink illustration, expressive eyes with manga highlights, sharp angular faces, dynamic action pose, dramatic manga panel composition, speed lines radiating from focal point, grayscale with optional single red accent for dramatic effect, pure white background or minimal screentone backdrop, bold black ink for shadows, flat screentone gradients, exaggerated emotions, sweat drops or action veins where appropriate, motion lines indicating movement, character-focused composition, cinematic manga framing, rough ink stroke textures, imperfect hand-drawn feel, vertical 9:16 mobile frame, 1080x1920 resolution",
    negativePrompt:
      "color (except permitted single red accent), photorealistic, 3D render, CGI, American comic style, Ben-Day dots, glossy shading, smooth gradients, watercolor, oil painting, western cartoon, Pixar style, Disney style, Simpsons style, retro comic pulp style, superhero comic, vibrant bright colors, soft pastels, beauty lighting, overexposed, studio lighting, realistic photography, soft shadows, cheerful cute style, anime-style flat colors, blurry, clean polished digital vector art, airbrush rendering, landscape, unreadable text, watermark, signature, bad anatomy, extra fingers, deformed face, distorted hands, missing limbs, ugly, low resolution, muddy contrast",
  },

  ILLUSTRATION: {
    label: "Illustration",
    mainPrompt:
      "cinematic animated adventure illustration, stylized 2D cartoon movie art, modern western animation aesthetic, soft cel-shaded rendering, clean expressive line art, cozy fantasy adventure atmosphere, painterly environment design, cinematic composition, warm natural lighting, atmospheric depth, detailed scenic backgrounds, whimsical exploration mood, emotionally expressive characters, large expressive eyes, soft facial features, adventure travel vibe, polished digital painting, subtle texture brushwork, cinematic color harmony, dynamic perspective, family-friendly animated film style, storybook-inspired environment, gentle rim lighting, balanced color palette, soft clouds and mist, highly detailed background art, consistent character design, same animated universe, same movie art direction, vertical mobile frame",
    negativePrompt:
      "photorealistic, realistic photography, hyperreal skin, pixar 3d, disney 3d render, ultra realistic, horror, dark gritty comic style, heavy noir shadows, overexposed lighting, low quality, blurry, muddy colors, bad anatomy, extra limbs, distorted hands, malformed face, ugly eyes, poorly drawn fingers, noisy image, pixelated, flat composition, stiff pose, dull environment, monochrome, watermark, text, logo, nsfw, grotesque, horror atmosphere, oversaturated colors, sharp harsh lighting, ugly shading, realistic wrinkles, lifeless eyes",
  },

  CARTOON_3D: {
    label: "3D Cartoon",
    mainPrompt:
      "stylized 3D cartoon character, cinematic animated movie style, pixar-inspired aesthetic, soft global illumination, expressive oversized eyes, rounded facial features, detailed fluffy hair, smooth skin shading, stylized proportions, highly detailed 3D render, cute animated character design, warm cinematic lighting, soft depth of field, vibrant yet balanced colors, polished subsurface scattering, realistic fabric textures, whimsical adventure atmosphere, high-end animated film look, clean render, cinematic composition, ultra detailed, charming personality, stylized realism, soft rim lighting, octane render style, disney-inspired 3d animation aesthetic, 9:16 vertical composition",
    negativePrompt:
      "realistic human, photorealistic skin, horror, creepy face, uncanny valley, low poly, bad anatomy, extra fingers, extra limbs, distorted eyes, blurry, noisy render, dark shadows, flat lighting, low detail, ugly face, poorly rendered hands, deformed body, realistic wrinkles, harsh contrast, grainy image, unreadable text, watermark, logo, nsfw, stiff pose",
  },
};

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
