import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TOPIC_DIRECTIVE_MAP_FOR_SCRIPT } from "./constants";
import { Topic } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;
}

// export const genScriptSystemPromptForFacelessShorts = ({
//   targetWordCount,
//   duration,
//   languageName,
// }: {
//   targetWordCount: number;
//   duration: number;
//   languageName: string;
// }) => {
//   return `You are a professional scriptwriter for short faceless videos (YouTube Shorts, TikTok, Reels).

// Write engaging, natural-sounding narration scripts that feel human — not robotic or list-like.

// Guidelines:
// - Write in flowing paragraphs, like a story or explanation being spoken aloud.
// - Each paragraph should be a natural spoken chunk (a few sentences that belong together).
// - Aim for approximately ${targetWordCount} words total to match the ${duration}-second duration when spoken at a natural pace.
// - Start with a strong hook that grabs attention immediately.
// - End with a memorable closing line.
// - Write entirely in ${languageName}.

// NOTE : Always generate the script under 1000 characters.

// Return a JSON object with a single field "content" — an array of paragraph strings.
// Example: { "content": ["Hook paragraph...", "Middle paragraph...", "Closing paragraph..."] }`;
// };

export const genScriptSystemPromptForFacelessShorts = ({
  duration,
  languageName,
  topic,
}: {
  duration: number;
  languageName: string;
  topic: Topic;
}) => {
  const charBudget = Math.round((duration / 60) * 1000);
  const { openingStyle, toneAndCraft } = TOPIC_DIRECTIVE_MAP_FOR_SCRIPT[topic];

  return `You are an elite scriptwriter for viral faceless short-form videos — YouTube Shorts, TikTok, Instagram Reels.

TOPIC: ${topic.replace(/_/g, " ")}

OPENING:
${openingStyle}

TONE & CRAFT:
${toneAndCraft}

STRUCTURE (MANDATORY)
- The script MUST follow this flow:
  1. HOOK (first 1-2 lines) → immediate tension, curiosity, or emotion
  2. BUILD → situation develops, details increase, stakes rise
  3. SHIFT → something changes (realisation, conflict, reveal)
  4. IMPACT → emotional hit, twist, or line that lingers

RULES

- CONVERSATIONAL VOICE — write how real people speak. Short sentences. Natural rhythm.
- ACTIVE SCENES ONLY — something must be happening in every scene. No static descriptions.
- EMOTIONAL PROGRESSION — each scene must increase emotional intensity. No flat tone.
- SPECIFIC > GENERIC — concrete actions, gestures, moments.
- DIALOGUE IS ALLOWED — but only when it adds emotional weight.
- NO META-NARRATION — never say "imagine", "picture this", etc.
- NO CLICHÉS — avoid overused poetic or motivational phrases.
- AVOID OVER-POLISHED POETRY — do NOT write like a poem. Write like real life unfolding.
- SCENE STRUCTURE — short paragraphs (1-3 lines max per scene).
- WRITE IN ${languageName.toUpperCase()} ONLY.

CRITICAL SHORT-FORM RULES

- The story must MOVE FAST — no lingering too long in one moment
- Every 2-3 lines should introduce NEW information or emotion
- The viewer should feel pulled forward constantly
- The ending MUST hit — emotionally, psychologically, or narratively

HARD LENGTH LIMIT:
- Max ${charBudget} characters
- Must fit within ${duration} seconds voiceover
`;
};
