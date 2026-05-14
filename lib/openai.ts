import { Topic, VIDEO_STYLE_CONFIG, VideoStyle } from "@/types";
import OpenAI from "openai";
import Together from "together-ai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { env } from "@/lib/env";
import { facelessShortsImagePrompt } from "./utils";

export const openAI = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const together = new Together({
  apiKey: env.TOGETHER_AI_API_KEY,
});

const ImageSceneSchema = z.object({
  sceneIndex: z.number().int(),
  scriptSegment: z.string(),
  sceneDescription: z.string(), // visual only — style suffix appended in code
});

const ImagePromptsResponseSchema = z.object({
  scenes: z.array(ImageSceneSchema),
});

export type ImageSceneResult = z.infer<typeof ImageSceneSchema>;

// ─── Generate scene descriptions ───────────────────────────────────────────────

export async function generateImagePrompts(
  scriptLines: string[], // full script array
  videoStyle: VideoStyle,
  topic: Topic,
  originalUserPrompt: string | null, // needed so AI knows visual world + any text overlays
): Promise<ImageSceneResult[]> {
  const fullScript = scriptLines.map((line, i) => `[${i}] ${line}`).join("\n");

  const userMessage = `Video style: ${videoStyle}
Topic: ${topic.replace(/_/g, " ")}
${originalUserPrompt ? `Original user prompt: ${originalUserPrompt}\n` : ""}
Script (${scriptLines.length} lines):
${fullScript}

Generate 4-10 scene descriptions for this script. Decide the optimal number based on narrative flow.`;

  const response = await openAI.responses.parse({
    model: "gpt-4o-mini",
    temperature: 0.4, // Lower than scriptwriting — we want consistent, precise visual descriptions
    input: [
      {
        role: "system",
        content: facelessShortsImagePrompt(),
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
    text: {
      format: zodTextFormat(ImagePromptsResponseSchema, "image_prompts"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("Failed to parse structured image prompts from AI.");
  }

  const scenes = response.output_parsed.scenes
    .sort((a, b) => a.sceneIndex - b.sceneIndex)
    .slice(0, 10); // hard cap — never more than 10

  if (scenes.length === 0) {
    throw new Error("AI returned zero scenes. Cannot generate images.");
  }

  return scenes;
}

// ─── Build final image prompt ──────────────────────────────────────────────────
// Called in the Inngest step — NOT inside generateImagePrompts.
// This keeps the AI job narrow and the style injection in code.

export function buildFinalPrompt(
  sceneDescription: string,
  videoStyle: VideoStyle,
): { prompt: string; negativePrompt: string } {
  const styleConfig = VIDEO_STYLE_CONFIG[videoStyle];

  return {
    prompt: `${sceneDescription}, ${styleConfig.mainPrompt}`,
    negativePrompt: styleConfig.negativePrompt,
  };
}

// ─── Generate image buffer ─────────────────────────────────────────────────────

export async function generateImageBuffer(
  prompt: string,
  negativePrompt: string,
): Promise<Buffer> {
  const response = await together.images.generate({
    model: "black-forest-labs/FLUX.2-dev",
    prompt,
    width: 1088,
    height: 1920,
    steps: 28, // FLUX Dev recommended range: 20-50
    seed: 15, // fixed seed for character consistency across scenes
    negative_prompt: negativePrompt,
    response_format: "base64",
  });

  if (!response.data?.[0]) {
    throw new Error("No image returned from Together AI.");
  }

  const b64 = response.data[0].b64_json;

  if (!b64) {
    throw new Error("Together AI returned empty base64 data.");
  }

  return Buffer.from(b64, "base64");
}

// tools -- tiktok script gen

const ScriptSchema = z.object({
  paragraphs: z
    .array(z.string())
    .describe("The spoken paragraphs of the script"),
});

export async function generateTikTokScript(
  topic: Topic,
  duration: number,
  prompt?: string,
): Promise<string[]> {
  // Approximate word count: 150 words per 60 seconds
  const wordCount = Math.floor((duration / 60) * 150);

  const systemPrompt = `You are an expert viral TikTok scriptwriter.
Your goal is to write a highly engaging, fast-paced script for a ${duration}-second TikTok video.

Topic: ${topic}
${prompt ? `User Prompt: ${prompt}` : ""}
Target Word Count: ~${wordCount} words.

RULES:
1. Start with a viral, attention-grabbing HOOK (first 3 seconds).
2. Keep the pacing extremely fast. Use short, punchy sentences.
3. No fluff. Get straight to the point.
4. End with a strong Call to Action (CTA).
5. DO NOT include any camera directions, speaker labels, or non-spoken text. ONLY the words to be spoken.
6. Return the script as an array of paragraphs. Each item in the array should be a distinct spoken block. Don't use short sentences.`;

  const response = await openAI.responses.parse({
    model: "gpt-4o-mini",
    input: [
      { role: "system", content: systemPrompt },
      { role: "user", content: "Write the script now." },
    ],
    text: {
      format: zodTextFormat(ScriptSchema, "script"),
    },
  });

  if (!response.output_parsed) {
    throw new Error("Failed to parse script from OpenAI");
  }

  return response.output_parsed.paragraphs;
}
