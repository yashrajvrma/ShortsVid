"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";
import { prisma } from "@/db";
import { Topic } from "@prisma/client";
import { genScriptSystemPromptForFacelessShorts } from "@/lib/utils";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const WORDS_PER_MINUTE = 130;

const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
};

const generateScriptSchema = z.object({
  languageCode: z.string().min(2).max(10),
  topic: z.nativeEnum(Topic),
  duration: z.number().int().min(15).max(300),
  prompt: z.string().min(1, "Prompt is required").max(1000),
});

type GenerateScriptParams = z.infer<typeof generateScriptSchema>;

function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code.toLowerCase()] ?? code;
}

function getTargetWordCount(durationSeconds: number): number {
  return Math.round((durationSeconds / 60) * WORDS_PER_MINUTE);
}

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

export async function generateScript(
  params: GenerateScriptParams,
): Promise<GenerateScriptResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/login");
    }

    const { languageCode, topic, duration, prompt } =
      generateScriptSchema.parse(params);

    const languageName = getLanguageName(languageCode);
    const targetWordCount = getTargetWordCount(duration);

    const userPrompt = `Topic: ${topic}
Duration: ${duration} seconds (~${targetWordCount} words)
Language: ${languageName}
Creative direction: ${prompt}`;

    // ── Call OpenAI ───────────────────────────────────────────────────────
    const completion = await openAi.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: genScriptSystemPromptForFacelessShorts({
            targetWordCount,
            duration,
            languageName,
          }),
        },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const rawContent = completion.choices[0]?.message?.content;
    if (!rawContent) {
      throw new Error("OpenAI returned an empty response.");
    }

    // ── Parse response ────────────────────────────────────────────────────
    const parsed = JSON.parse(rawContent);
    const paragraphs: string[] = (parsed.content ?? []).filter(
      (p: unknown) => typeof p === "string" && p.trim().length > 0,
    );

    if (paragraphs.length === 0) {
      throw new Error("Failed to generate script content.");
    }

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

    console.error("Generate Script Error:", error);

    return { success: false, error: message };
  }
}
