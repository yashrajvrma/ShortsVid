"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { CREDITS_PER_VIDEO } from "@/lib/polar";
import { openAI } from "@/lib/openai";
import {
  getLanguageName,
  systemPromptForConversationVideos,
} from "@/lib/utils";
import { Topic } from "@prisma/client";

const generateDialogueSchema = z.object({
  languageCode: z.string().min(2).max(10),
  topic: z.nativeEnum(Topic),
  duration: z
    .number()
    .int()
    .refine((v) => [15, 30, 60].includes(v), {
      message: "Duration must be 15, 30, or 60 seconds.",
    }),
  prompt: z.string().min(1, "Prompt is required").max(1000),
  speaker1Name: z.string().optional(),
  speaker2Name: z.string().optional(),
});

type GenerateDialogueParams = z.infer<typeof generateDialogueSchema>;

const DialogueLineSchema = z.object({
  speaker: z.union([z.literal(1), z.literal(2)]),
  text: z.string().min(1),
});

const DialogueOutput = z.object({
  lines: z
    .array(DialogueLineSchema)
    .min(4)
    .describe(
      "Ordered array of dialogue lines alternating between Speaker 1 and Speaker 2.",
    ),
});

export type GeneratedDialogueLine = {
  speaker: 1 | 2;
  text: string;
};

export type GenerateDialogueResult =
  | { success: true; lines: GeneratedDialogueLine[]; languageCode: string }
  | { success: false; error: string };

export async function generateDialogue(
  params: GenerateDialogueParams,
): Promise<GenerateDialogueResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      redirect("/login");
    }

    if (session.user.credit < CREDITS_PER_VIDEO) {
      return {
        success: false,
        error: "Insufficient credits. Please upgrade your plan.",
      };
    }

    const { languageCode, topic, duration, prompt, speaker1Name, speaker2Name } =
      generateDialogueSchema.parse(params);
    const languageName = getLanguageName(languageCode);

    const cleanSpeaker1Name = speaker1Name?.replace(/\s*\d+$/, "").trim() || "Speaker 1";
    const cleanSpeaker2Name = speaker2Name?.replace(/\s*\d+$/, "").trim() || "Speaker 2";

    const userPrompt = `Target duration: ${duration} seconds
Creative direction: ${prompt}

Write the dialogue now. Remember: output ONLY valid JSON matching the required schema.`;

    const response = await openAI.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: systemPromptForConversationVideos(
            duration,
            languageName,
            topic,
            cleanSpeaker1Name,
            cleanSpeaker2Name
          ),
        },
        { role: "user", content: userPrompt },
      ],
      text: {
        format: zodTextFormat(DialogueOutput, "dialogue"),
      },
    });

    if (!response.output_parsed) {
      return {
        success: false,
        error:
          "The model declined to generate a dialogue. Please adjust your prompt and try again.",
      };
    }

    const lines: GeneratedDialogueLine[] = [];
    let expectedSpeaker: 1 | 2 = 1;

    for (const line of response.output_parsed.lines) {
      const text = line.text.trim();
      if (!text) continue;
      lines.push({ speaker: expectedSpeaker, text });
      expectedSpeaker = expectedSpeaker === 1 ? 2 : 1;
    }

    if (lines.length < 2) {
      return {
        success: false,
        error: "Failed to generate enough dialogue content. Please try again.",
      };
    }

    return { success: true, lines, languageCode };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("[generateDialogue] error:", error);
    return { success: false, error: message };
  }
}
