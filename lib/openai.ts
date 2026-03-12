import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ─── Enums (mirrored from Prisma schema) ────────────────────────────────────

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

// ─── Zod Schemas for Structured Outputs ─────────────────────────────────────

const ImageSceneSchema = z.object({
  sceneIndex: z
    .number()
    .int()
    .describe("Zero-based index matching the script paragraph position"),
  prompt: z
    .string()
    .describe(
      "Highly detailed image generation prompt for this scene — no text or logos in the image",
    ),
  mood: z
    .string()
    .describe(
      "One or two words describing the emotional mood of this scene (e.g. 'tense', 'hopeful')",
    ),
});

const ImagePromptsResponseSchema = z.object({
  scenes: z
    .array(ImageSceneSchema)
    .describe("One scene per script paragraph, in order"),
});

export type ImagePromptResult = z.infer<typeof ImageSceneSchema>;

// ─── Topic → Prompt Style Guide ─────────────────────────────────────────────

const TOPIC_STYLE_GUIDE: Record<Topic, string> = {
  MOTIVATIONAL:
    "Uplifting, energetic visuals — sunrise, determined people, achievement moments, bold colours",
  HORROR_STORY:
    "Dark, eerie, suspenseful atmosphere — shadowy environments, fog, unsettling details, high contrast",
  HISTORY_FACTS:
    "Period-accurate, documentary style — historical settings, artifacts, maps, aged textures",
  PHILOSOPHY:
    "Abstract, thought-provoking imagery — cosmic scenes, silhouettes, metaphorical compositions",
  STORYTELLING:
    "Narrative, scene-setting visuals — rich environments, character-driven moments, cinematic framing",
  MYSTERY_STORY:
    "Suspenseful, noir-like atmosphere — dim lighting, hidden clues, shadowy figures, intrigue",
  LIFE_HACKS:
    "Clean, practical, everyday settings — clear demonstrations, bright lighting, relatable objects",
  ANY_TOPIC:
    "Versatile, visually compelling — match the tone and emotion of the script line closely",
};

// ─── VideoStyle → Visual Style Guide ────────────────────────────────────────

const VIDEO_STYLE_GUIDE: Record<VideoStyle, string> = {
  PHOTO_REALISTIC:
    "ultra-photorealistic photography, shot on full-frame DSLR, natural lighting, 8K detail, hyper-realistic textures",
  CARTOON:
    "vibrant cartoon illustration, bold clean outlines, flat cel-shaded colours, playful and expressive characters",
  ANIME:
    "Japanese anime art style, cel-shaded, expressive characters, dynamic action poses, Studio Ghibli / Makoto Shinkai quality",
  CYBERPUNK:
    "cyberpunk aesthetic, neon-lit rain-soaked streets, holographic overlays, dystopian megacity, high-contrast neon palette (purple, cyan, pink), blade runner atmosphere",
  CINEMATIC:
    "dramatic cinematic lighting, anamorphic lens flares, film grain, shallow depth-of-field, Hollywood blockbuster colour grade",
  PIXEL_ART:
    "retro pixel art style, 16-bit or 32-bit palette, chunky pixels, clean sprite-like characters, nostalgic video-game aesthetic",
  COLORFUL_COMICS:
    "vibrant comic book illustration, bold ink outlines, halftone dot shading, saturated pop-art colours, dynamic panel-style composition",
};

// ─── Image Prompt Generation (Structured Output) ─────────────────────────────

/**
 * Uses GPT-4o with Zod structured output to generate one image prompt
 * per script paragraph, tailored to the topic and video style.
 */
export async function generateImagePrompts(
  scriptParagraphs: string[],
  videoStyle: VideoStyle,
  topic: Topic,
): Promise<ImagePromptResult[]> {
  const topicGuide = TOPIC_STYLE_GUIDE[topic] ?? TOPIC_STYLE_GUIDE.ANY_TOPIC;
  const styleGuide =
    VIDEO_STYLE_GUIDE[videoStyle] ?? VIDEO_STYLE_GUIDE.PHOTO_REALISTIC;

  const systemPrompt = `You are a creative director specialising in short-form vertical video (9:16, YouTube Shorts / TikTok).
For each script paragraph you receive, generate ONE detailed image generation prompt that:
  • Matches the topic mood: ${topicGuide}
  • Uses the visual style: ${styleGuide}
  • Is optimised for 9:16 vertical composition
  • Contains NO text, watermarks, logos, or UI elements in the scene
  • Is vivid, specific, and cinematic — describe lighting, camera angle, atmosphere, and subject clearly
  • Each paragraph maps to exactly ONE scene in the same order`;

  const userPrompt = `Topic: ${topic}
Video Style: ${videoStyle}

Script paragraphs (${scriptParagraphs.length} total):
${scriptParagraphs.map((p, i) => `[${i}] ${p}`).join("\n\n")}

Generate exactly ${scriptParagraphs.length} scene prompts, one per paragraph, in order (sceneIndex 0 to ${scriptParagraphs.length - 1}).`;

  const response = await openai.responses.parse({
    model: "gpt-4o-2024-08-06",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    text: {
      format: zodTextFormat(ImagePromptsResponseSchema, "image_prompts"),
    },
  });

  const parsed = response.output_parsed;
  if (!parsed)
    throw new Error("Structured output parsing failed for image prompts");

  // Guarantee ordering by sceneIndex
  return parsed.scenes.sort((a, b) => a.sceneIndex - b.sceneIndex);
}

// ─── Image Generation — gpt-image-1 (medium quality) ────────────────────────

/**
 * Generates a single image using gpt-image-1 at medium quality
 * and returns the raw PNG buffer.
 */
export async function generateImageBuffer(
  prompt: string,
  mood: string,
): Promise<Buffer> {
  const enrichedPrompt = [
    prompt,
    `Mood: ${mood}.`,
    "Vertical 9:16 aspect ratio. No text, no watermarks, no logos, no UI elements.",
  ].join(" ");

  const response = await openai.images.generate({
    model: "gpt-image-1",
    prompt: enrichedPrompt,
    size: "1024x1792", // 9:16 vertical
    quality: "medium",
  });

  if (!response.data || !response.data[0])
    throw new Error("No image data returned from gpt-image-1");

  const b64 = response.data[0].b64_json!;

  return Buffer.from(b64, "base64");
}
