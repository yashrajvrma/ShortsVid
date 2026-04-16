import { Topic, VideoStyle } from "@/types";
import OpenAI from "openai";
import Together from "together-ai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

export const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const together = new Together({
  apiKey: process.env.TOGETHER_AI_API_KEY!,
});

const CharacterSchema = z.object({
  name: z.string(),
  description: z.string(), // fixed visual identity
});

const ImageSceneSchema = z.object({
  sceneIndex: z.number().int(),
  scriptSegment: z.string(),
  prompt: z.string(),
  mood: z.string(),
});

const ImagePromptsResponseSchema = z.object({
  characters: z.array(CharacterSchema),
  scenes: z.array(ImageSceneSchema),
});

export type ImagePromptResult = z.infer<typeof ImageSceneSchema>;

const TOPIC_STYLE_GUIDE: Record<Topic, string> = {
  MOTIVATIONAL:
    "uplifting, energetic, high emotion, inspiring moments, strong visual contrast",
  HORROR_STORY:
    "dark, eerie, unsettling, suspenseful, shadows, tension, horror atmosphere",
  HISTORY_FACTS:
    "historical realism, period accuracy, documentary feel, authentic environments",
  PHILOSOPHY:
    "abstract, symbolic, minimal, metaphor-driven, thought-provoking imagery",
  STORYTELLING:
    "narrative-driven, expressive characters, emotionally rich scenes",
  MYSTERY_STORY: "noir, suspense, hidden details, investigative tone, intrigue",
  LIFE_HACKS: "clean, practical, bright, everyday relatable environments",
  ANY_TOPIC: "visually engaging, emotionally aligned with the script",
};

const VIDEO_STYLE_GUIDE: Record<
  VideoStyle,
  {
    base: string;
    rules: string;
  }
> = {
  PHOTO_REALISTIC: {
    base: "ultra realistic, DSLR photography, natural textures, real-world detail",
    rules:
      "use real-world lighting, camera angles allowed, physically accurate details",
  },
  CARTOON: {
    base: "cartoon illustration, bold outlines, flat colors, stylized characters",
    rules:
      "no realistic camera jargon, use expressive poses, exaggerated emotions",
  },
  ANIME: {
    base: "anime style, cel shading, expressive eyes, detailed backgrounds",
    rules: "dynamic angles allowed, vibrant lighting, stylized emotion",
  },
  CYBERPUNK: {
    base: "cyberpunk aesthetic, neon lights, futuristic dystopia, high contrast",
    rules:
      "use neon glow, reflections, dramatic lighting, tech-heavy environments",
  },
  CINEMATIC: {
    base: "cinematic film still, dramatic lighting, film grain, depth of field",
    rules:
      "use camera angles, lens terms, lighting techniques, movie-like framing",
  },
  PIXEL_ART: {
    base: "pixel art, 16-bit style, low resolution sprites, retro game look",
    rules: "NO camera/lens terms, describe composition simply, blocky visuals",
  },
  COLORFUL_COMICS: {
    base: "comic book style, bold ink lines, halftone shading, vibrant pop-art colors",
    rules: "dynamic poses, panel-like composition, exaggerated action",
  },
};

export async function generateImagePrompts(
  scriptParagraphs: string[],
  videoStyle: VideoStyle,
  topic: Topic,
): Promise<{
  characters: z.infer<typeof CharacterSchema>[];
  scenes: ImagePromptResult[];
}> {
  const topicGuide = TOPIC_STYLE_GUIDE[topic];
  const styleGuide = VIDEO_STYLE_GUIDE[videoStyle];

  const fullScript = scriptParagraphs.join("\n\n");

  const systemPrompt = `You are an expert visual storyteller and prompt engineer for Stable Diffusion 3.

Your job is to convert a short-form video script into structured image prompts.

---

STEP 1 — CHARACTER DESIGN

- Extract ALL recurring characters
- Give each a FIXED visual identity:
  age, gender, height, hairstyle, clothing, defining traits
- These MUST remain identical across ALL scenes

---

STEP 2 — SCENE BREAKDOWN

- Break script into 4-8 scenes
- Each scene = one clear visual moment
- Scenes must show progression (not static repetition)

---

STEP 3 — PROMPT CREATION

Each prompt must follow:

[subject + character description]
[action]
[environment]
[lighting or visual mood]
[composition or framing (ONLY if style allows)]
[style keywords]

---

STYLE APPLICATION

Topic tone:
${topicGuide}

Visual style:
${styleGuide.base}

Style rules:
${styleGuide.rules}

---

STRICT RULES

- Maintain EXACT same character appearance across scenes
- Do NOT randomly change outfit, face, or body
- ALL prompts must repeat FULL character descriptions in EVERY scene
- NEVER shorten character descriptions
- NEVER say "same person" or "same character"
- ALWAYS restate full appearance explicitly in each prompt
- Keep prompts VISUAL (not poetic, not narrative)
- Avoid unnecessary storytelling words
- Optimize for Stable Diffusion 3

- ALWAYS include:
  "vertical 9:16 composition"

- NEVER include:
  text, subtitles, watermark, logo, UI

---

OUTPUT FORMAT

Return JSON with:
- characters[]
- scenes[]

sceneIndex must start from 0
`;

  const userPrompt = `Topic: ${topic}
Video Style: ${videoStyle}

Script:
"""
${fullScript}
"""

Generate structured SD3 prompts with strong visual clarity.

Maintain character consistency strictly.`;

  const response = await openAI.responses.parse({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    text: {
      format: zodTextFormat(ImagePromptsResponseSchema, "image_prompts"),
    },
  });

  const parsed = response.output_parsed;

  if (!parsed) {
    throw new Error("Failed to parse structured image prompts");
  }

  return {
    characters: parsed.characters,
    scenes: parsed.scenes.sort((a, b) => a.sceneIndex - b.sceneIndex),
  };
}

export async function generateImageBuffer(
  prompt: string,
  mood: string,
  referenceImage?: string,
): Promise<Buffer> {
  const finalPrompt = [
    prompt,
    `mood: ${mood}`,
    "high detail",
    "sharp focus",
  ].join(", ");

  const response = await together.images.generate({
    model: "stabilityai/stable-diffusion-3-medium",
    prompt: finalPrompt,
    width: 768,
    height: 1344,
    steps: 35,
    seed: 15,
    negative_prompt:
      "low quality, blurry, pixelated, distorted, extra limbs, watermark, text, deformed hands",
    response_format: "base64",
  });

  if (!response.data || !response.data[0]) {
    throw new Error("No image returned from Together AI");
  }

  const b64 = response.data[0].b64_json;
  return Buffer.from(b64, "base64");
}
