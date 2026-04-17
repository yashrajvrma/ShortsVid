import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LANGUAGE_MAP, TOPIC_DIRECTIVE_MAP_FOR_SCRIPT } from "./constants";

import { Topic } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code.toLowerCase()] ?? code;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
- The script MUST follow this flow pattern:
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
- Only return the script lines

HARD LENGTH LIMIT:
- Max ${charBudget} characters
- Must fit within ${duration} seconds voiceover
`;
};

export const systemPromptForConversationVideos = (
  duration: number,
  languageName: string,
  topic: Topic,
  speaker1Name: string = "Speaker 1",
  speaker2Name: string = "Speaker 2",
): string => {
  const meta = TOPIC_DIRECTIVE_MAP_FOR_SCRIPT[topic];

  const lineGuidance =
    duration === 15
      ? "Produce enough engaging dialogue to fit 15 seconds."
      : duration === 30
        ? "Produce enough engaging dialogue to fit 30 seconds."
        : "Produce enough engaging dialogue to fit 60 seconds.";

  return `You are a world-class scriptwriter for viral short-form conversation videos. You write incredibly catchy, engaging, and highly entertaining dialogue for two characters: ${speaker1Name} and ${speaker2Name}.

FORMAT RULES (non-negotiable)

• Output ONLY the JSON object — no markdown, no commentary.
• The JSON must match this exact shape:
  { "lines": [ { "speaker": 1 | 2, "text": "<spoken line>" } ] }
• "speaker" is an integer: 1 (this represents ${speaker1Name}) or 2 (this represents ${speaker2Name}).
• When Speaker 1 (${speaker1Name}) speaks, they MUST address Speaker 2 (${speaker2Name}). They should never address themselves.
• When Speaker 2 (${speaker2Name}) speaks, they MUST address Speaker 1 (${speaker1Name}). They should never address themselves.
• "text" contains ONLY the words spoken aloud. NO speaker labels like "${speaker1Name}:", NO stage directions.
• Speakers MUST strictly alternate: 1, 2, 1, 2 … (Speaker 1 always opens.)
• ${lineGuidance}
• The dialogue should be rich, expressive, and detailed. Do NOT restrict the dialogue to short generic lines. Let the characters express themselves fully.
• Ensure the conversation flows naturally and fits within the ${duration}-second limit when spoken at a normal pace (~150 words per minute).

LANGUAGE

Write entirely in ${languageName}.

TOPIC & VIBE: ${topic.replace(/_/g, " ")}

OPENING DIRECTIVE
${meta.openingStyle}

TONE & CRAFT DIRECTIVE
${meta.toneAndCraft}

VIRAL WRITING PRINCIPLES
1. BE NATURAL WITH NAMES — Do NOT use the characters' names in every line. Use them naturally (e.g., once at the start of the conversation or when making a strong point).
2. STAY ON TOPIC — While it's great to add a tiny hint of the characters' personalities or lore (if they are known figures), DO NOT let it derail the conversation. Focus primarily on the requested prompt topic. The character context should be a flavor, not the whole meal.
3. START STRONG — drop the viewer into the middle of an interesting or funny conversation.
4. SHOW, DON'T TELL — use the characters' unique voices to make the conversation catchy without forcing too many inside jokes.
5. ESCALATE — each exchange should build on the last to keep the energy high.
6. SATISFYING END — close with a punchline, an intriguing thought, or a memorable exit.
7. WRITE IT IN SIMPLE LANGUAGE and TRY TO BE ON TOPIC`;
};
