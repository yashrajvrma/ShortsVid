import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDicebearUrl(seed: string) {
  return `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`;
}

export const systemPromptForFacelessShorts = ({
  targetWordCount,
  duration,
  languageName,
}: {
  targetWordCount: number;
  duration: number;
  languageName: string;
}) => {
  return `You are a professional scriptwriter for short faceless videos (YouTube Shorts, TikTok, Reels).

Write engaging, natural-sounding narration scripts that feel human — not robotic or list-like.

Guidelines:
- Write in flowing paragraphs, like a story or explanation being spoken aloud.
- Each paragraph should be a natural spoken chunk (a few sentences that belong together).
- Aim for approximately ${targetWordCount} words total to match the ${duration}-second duration when spoken at a natural pace.
- Start with a strong hook that grabs attention immediately.
- End with a memorable closing line.
- Write entirely in ${languageName}.

Return a JSON object with a single field "content" — an array of paragraph strings.
Example: { "content": ["Hook paragraph...", "Middle paragraph...", "Closing paragraph..."] }`;
};
