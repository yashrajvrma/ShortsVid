"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { prisma } from "@/db";
import { Topic } from "@prisma/client";
import { genScriptSystemPromptForFacelessShorts } from "@/lib/utils";
import { CREDITS_PER_VIDEO } from "@/lib/polar";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Language map ─────────────────────────────────────────────────────────────
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
};

// ── Request schema ────────────────────────────────────────────────────────────
const generateScriptSchema = z.object({
  languageCode: z.string().min(2).max(10),
  topic: z.nativeEnum(Topic),
  /** Supported durations for Shorts: 15 | 30 | 60 seconds */
  duration: z
    .number()
    .int()
    .refine((v) => [15, 30, 60].includes(v), {
      message: "Duration must be 15, 30, or 60 seconds.",
    }),
  prompt: z.string().min(1, "Prompt is required").max(1000),
});

type GenerateScriptParams = z.infer<typeof generateScriptSchema>;

// ── Structured output schema ──────────────────────────────────────────────────
const ScriptOutput = z.object({
  scenes: z
    .array(z.string())
    .min(1)
    .describe("Ordered array of scene paragraphs that form the full script."),
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code.toLowerCase()] ?? code;
}

// ── Return type ───────────────────────────────────────────────────────────────
export type GenerateScriptResult =
  | {
      success: true;
      scriptId: string;
      script: string;
      paragraphs: string[];
    }
  | {
      success: false;
      error: string;
    };

// ── Server action ─────────────────────────────────────────────────────────────
export async function generateScript(
  params: GenerateScriptParams,
): Promise<GenerateScriptResult> {
  try {
    // Auth check
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/login");
    }

    const user = session.user;

    if (user.credit < CREDITS_PER_VIDEO) {
      throw new Error("Insufficient credits. Please upgrade your plan");
    }

    const { languageCode, topic, duration, prompt } =
      generateScriptSchema.parse(params);

    const languageName = getLanguageName(languageCode);

    const userPrompt = `Target duration: ${duration} seconds
Creative direction: ${prompt}

Write a viral short-form video script that fits comfortably within ${duration} seconds when spoken aloud.`;

    // ── Structured output call ────────────────────────────────────────────
    const response = await openAi.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: genScriptSystemPromptForFacelessShorts({
            duration,
            languageName,
            topic,
          }),
        },
        { role: "user", content: userPrompt },
      ],
      text: {
        format: zodTextFormat(ScriptOutput, "script"),
      },
    });

    // output_parsed is null when the model refuses (content policy, etc.)
    if (!response.output_parsed) {
      throw new Error(
        "The model declined to generate a script. Please adjust your prompt and try again.",
      );
    }

    const paragraphs = response.output_parsed.scenes.filter(
      (s) => s.trim().length > 0,
    );

    if (paragraphs.length === 0) {
      throw new Error("Failed to generate script content.");
    }

    // ── Persist to DB ─────────────────────────────────────────────────────
    const scriptRecord = await prisma.script.create({
      data: {
        userId: session.user.id,
        languageCode,
        topic,
        duration,
        prompt,
        content: paragraphs,
      },
    });

    return {
      success: true,
      scriptId: scriptRecord.id,
      script: paragraphs.join("\n\n"),
      paragraphs,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    console.error("Generate script error:", error);

    return { success: false, error: message };
  }
}
