"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { CREDITS_PER_VIDEO } from "@/lib/polar";
import type { DialogueLine } from "@/hooks/use-conversation-form";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Language map ──────────────────────────────────────────────────────────────
const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
};

function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code.toLowerCase()] ?? code;
}

// ── Request schema ────────────────────────────────────────────────────────────
const generateDialogueSchema = z.object({
  languageCode: z.string().min(2).max(10),
  topic: z.string().min(1),
  duration: z
    .number()
    .int()
    .refine((v) => [15, 30, 60].includes(v), {
      message: "Duration must be 15, 30, or 60 seconds.",
    }),
  prompt: z.string().min(1, "Prompt is required").max(1000),
});

type GenerateDialogueParams = z.infer<typeof generateDialogueSchema>;

// ── Structured output schema ──────────────────────────────────────────────────
const DialogueOutput = z.object({
  lines: z
    .array(
      z.object({
        speaker: z.union([z.literal(1), z.literal(2)]),
        text: z.string().min(1),
      }),
    )
    .min(2)
    .describe(
      "Ordered array of dialogue lines alternating between Speaker 1 and Speaker 2.",
    ),
});

// ── Return type ───────────────────────────────────────────────────────────────
export type GenerateDialogueResult =
  | {
      success: true;
      lines: Omit<DialogueLine, "id">[];
      languageCode: string;
    }
  | {
      success: false;
      error: string;
    };

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(duration: number, languageName: string, topic: string): string {
  return `You are a scriptwriter specialising in viral short-form conversational video content.

You must write a DIALOGUE between exactly TWO speakers (Speaker 1 and Speaker 2).
The dialogue must fit comfortably within ${duration} seconds when spoken aloud at a natural pace.

Rules:
- Write in ${languageName}.
- Topic / theme: ${topic}.
- Alternate speakers naturally — no monologues. Each line should be 1–3 sentences max.
- Aim for 6–16 lines total depending on the duration.
- The conversation should feel natural, engaging, and shareable — like a real conversation between two people.
- Keep it punchy and scroll-stopping. Start in the middle of a thought or reaction.
- Do NOT include speaker name labels in the text field itself — only use the speaker number field.
- Output a JSON array of objects with "speaker" (1 or 2) and "text" fields.`;
}

// ── Server action ─────────────────────────────────────────────────────────────
export async function generateDialogue(
  params: GenerateDialogueParams,
): Promise<GenerateDialogueResult> {
  try {
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
      generateDialogueSchema.parse(params);

    const languageName = getLanguageName(languageCode);

    const userPrompt = `Target duration: ${duration} seconds
Creative direction: ${prompt}

Write a viral short-form conversational video script between two speakers that fits within ${duration} seconds.`;

    const response = await openAi.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: buildSystemPrompt(duration, languageName, topic),
        },
        { role: "user", content: userPrompt },
      ],
      text: {
        format: zodTextFormat(DialogueOutput, "dialogue"),
      },
    });

    if (!response.output_parsed) {
      throw new Error(
        "The model declined to generate a dialogue. Please adjust your prompt and try again.",
      );
    }

    const lines = response.output_parsed.lines.filter(
      (l) => l.text.trim().length > 0,
    );

    if (lines.length === 0) {
      throw new Error("Failed to generate dialogue content.");
    }

    return {
      success: true,
      lines,
      languageCode,
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Generate dialogue error:", error);
    return { success: false, error: message };
  }
}
