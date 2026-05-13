// "use server";

// import { auth } from "@/lib/auth/server";
// import { headers } from "next/headers";
// import { redirect } from "next/navigation";
// import { z } from "zod";
// import { zodTextFormat } from "openai/helpers/zod";
// import { prisma } from "@/db";
// import { Topic } from "@prisma/client";
// import { facelessShortsPrompt } from "@/lib/utils";
// import { CREDITS_PER_VIDEO } from "@/lib/polar";
// import { openAI } from "@/lib/openai";
// import { getLanguageName } from "@/lib/utils";

// const generateScriptSchema = z.object({
//   languageCode: z.string().min(2).max(10),
//   topic: z.nativeEnum(Topic),
//   duration: z
//     .number()
//     .int()
//     .refine((v) => [15, 30, 60].includes(v), {
//       message: "Duration must be 15, 30, or 60 seconds.",
//     }),
//   prompt: z.string().min(1, "Prompt is required").max(1000),
// });

// type GenerateScriptParams = z.infer<typeof generateScriptSchema>;

// const ScriptOutput = z.object({
//   scenes: z
//     .array(z.string())
//     .min(1)
//     .describe("Ordered array of scene paragraphs that form the full script."),
// });

// export type GenerateScriptResult =
//   | {
//       success: true;
//       scriptId: string;
//       script: string;
//       paragraphs: string[];
//     }
//   | {
//       success: false;
//       error: string;
//     };

// export async function generateScript(
//   params: GenerateScriptParams,
// ): Promise<GenerateScriptResult> {
//   try {
//     // Auth check
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session?.user) {
//       redirect("/login?redirect=/app/shorts/faceless-shorts");
//     }

//     const user = session.user;

//     if (user.credit < CREDITS_PER_VIDEO) {
//       throw new Error("Insufficient credits. Please upgrade your plan");
//     }

//     const { languageCode, topic, duration, prompt } =
//       generateScriptSchema.parse(params);

//     const languageName = getLanguageName(languageCode);

//     //     const userPrompt = `Target duration: ${duration} seconds
//     // Creative direction: ${prompt}

//     // Write a viral short-form video script that fits comfortably within ${duration} seconds when spoken aloud.`;

//     const userPrompt = `
// TARGET DURATION: ${duration} seconds

// USER CREATIVE DIRECTION:
// ${prompt}

// IMPORTANT:
// - Preserve the visual atmosphere and cinematic style from the user's direction
// - Create scenes that are visually powerful and image-generation friendly
// - The script should feel like a cinematic short film
// - Prioritize memorable visual moments over excessive narration
// - Every scene should feel drawable and cinematic

// Generate a high-retention viral cinematic short-form video script.

// The script should feel like:
// - a professionally edited anime TikTok
// - a viral YouTube Shorts edit
// - a cinematic transformation montage
// - an emotionally intense action trailer

// Prioritize:
// - escalation
// - pacing
// - emotional intensity
// - visual progression
// - edit-friendly scenes
// - unforgettable moments

// The viewer should feel hooked from the first scene to the final frame.
// `;

//     const response = await openAI.responses.parse({
//       model: "gpt-4o-mini",
//       input: [
//         {
//           role: "system",
//           content: facelessShortsPrompt({
//             duration,
//             languageName,
//             topic,
//           }),
//         },
//         { role: "user", content: userPrompt },
//       ],
//       text: {
//         format: zodTextFormat(ScriptOutput, "script"),
//       },
//     });

//     // output_parsed is null when the model refuses (content policy, etc.)
//     if (!response.output_parsed) {
//       throw new Error(
//         "The model declined to generate a script. Please adjust your prompt and try again.",
//       );
//     }

//     const paragraphs = response.output_parsed.scenes.filter(
//       (s) => s.trim().length > 0,
//     );

//     if (paragraphs.length === 0) {
//       throw new Error("Failed to generate script content.");
//     }

//     const scriptRecord = await prisma.script.create({
//       data: {
//         userId: session.user.id,
//         languageCode,
//         topic,
//         duration,
//         prompt,
//         content: paragraphs,
//       },
//     });

//     return {
//       success: true,
//       scriptId: scriptRecord.id,
//       script: paragraphs.join("\n\n"),
//       paragraphs,
//     };
//   } catch (error: unknown) {
//     const message =
//       error instanceof Error ? error.message : "An unexpected error occurred.";

//     console.error("Generate script error:", error);

//     return { success: false, error: message };
//   }
// }

"use server";

import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { prisma } from "@/db";
import { Topic } from "@prisma/client";
import { facelessShortsPrompt } from "@/lib/utils";
import { CREDITS_PER_VIDEO } from "@/lib/polar";
import { openAI } from "@/lib/openai";
import { getLanguageName } from "@/lib/utils";

// ─── Validation ────────────────────────────────────────────────────────────────

const generateScriptSchema = z.object({
  languageCode: z.string().min(2).max(10),
  topic: z.nativeEnum(Topic),
  duration: z
    .number()
    .int()
    .refine((v) => [15, 30, 60].includes(v), {
      message: "Duration must be 15, 30, or 60 seconds.",
    }),
  prompt: z.string().min(1, "Prompt is required").max(1000),
});

type GenerateScriptParams = z.infer<typeof generateScriptSchema>;

// ─── Output schema ─────────────────────────────────────────────────────────────

const ScriptOutput = z.object({
  scenes: z
    .array(z.string())
    .min(1)
    .describe(
      "Ordered array of spoken voiceover lines. Each string is exactly what the voice actor reads aloud.",
    ),
});

// ─── Return type ───────────────────────────────────────────────────────────────

export type GenerateScriptResult =
  | { success: true; scriptId: string; script: string; paragraphs: string[] }
  | { success: false; error: string };

// ─── Action ────────────────────────────────────────────────────────────────────

export async function generateScript(
  params: GenerateScriptParams,
): Promise<GenerateScriptResult> {
  try {
    // ── Auth ──────────────────────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      redirect("/login?redirect=/app/shorts/faceless-shorts");
    }

    if (session.user.credit < CREDITS_PER_VIDEO) {
      throw new Error("Insufficient credits. Please upgrade your plan.");
    }

    // ── Parse & validate ──────────────────────────────────────────────────────
    const { languageCode, topic, duration, prompt } =
      generateScriptSchema.parse(params);

    const languageName = getLanguageName(languageCode);

    // ── User message ──────────────────────────────────────────────────────────
    // Minimal by design — the system prompt carries all instructions.
    // The user message is purely the creative direction from the user.
    const userMessage = `Topic: ${topic.replace(/_/g, " ")}
Duration: ${duration} seconds
Creative direction: ${prompt}`;

    // ── Call OpenAI ───────────────────────────────────────────────────────────
    const response = await openAI.responses.parse({
      model: "gpt-4o-mini",
      temperature: 0.9, // High creativity — scripts need freshness and variety
      input: [
        {
          role: "system",
          content: facelessShortsPrompt({ duration, languageName, topic }),
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      text: {
        format: zodTextFormat(ScriptOutput, "script"),
      },
    });

    // ── Handle refusal ────────────────────────────────────────────────────────
    if (!response.output_parsed) {
      throw new Error(
        "The model declined to generate a script. Please adjust your prompt and try again.",
      );
    }

    // ── Filter empty lines ────────────────────────────────────────────────────
    const paragraphs = response.output_parsed.scenes.filter(
      (line) => line.trim().length > 0,
    );

    if (paragraphs.length === 0) {
      throw new Error("Failed to generate script content.");
    }

    // ── Persist ───────────────────────────────────────────────────────────────
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

    console.error("[generateScript] error:", error);

    return { success: false, error: message };
  }
}
