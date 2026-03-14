// import { openai } from "./openai";
// import { getSignedAudioUrl } from "@/lib/r2-bucket";

// // ─── Types ───────────────────────────────────────────────────────────────────

// export type CaptionWord = {
//   word: string;
//   start: number;
//   end: number;
// };

// export type CaptionSegment = {
//   text: string;
//   start: number;
//   end: number;
//   words: CaptionWord[];
// };

// export type CaptionChunk = {
//   text: string;
//   start: number;
//   end: number;
//   words: CaptionWord[];
// };

// export type CaptionData = {
//   segments: CaptionSegment[];
//   chunks: CaptionChunk[];
//   fullText: string;
//   duration: number;
// };

// // ─── Caption Generation ──────────────────────────────────────────────────────

// /**
//  * Accepts the R2 object key for the voiceover audio.
//  * Generates a short-lived signed URL internally (never stored),
//  * fetches the audio, and sends it to Whisper for word-level transcription.
//  */
// export async function generateCaptions(
//   audioR2Key: string,
//   languageCode: string = "en",
//   wordsPerChunk: number = 3,
// ): Promise<CaptionData> {
//   // Generate a short-lived signed URL — only used here, never persisted
//   const signedUrl = await getSignedAudioUrl(audioR2Key, 300); // 5 min TTL

//   const audioRes = await fetch(signedUrl);
//   if (!audioRes.ok) {
//     throw new Error(
//       `Failed to fetch audio for transcription — HTTP ${audioRes.status}`,
//     );
//   }

//   const arrayBuffer = await audioRes.arrayBuffer();

//   // OpenAI SDK accepts a File object (Web API) — works in Node 18+ / edge
//   const audioFile = new File([arrayBuffer], "voiceover.mp3", {
//     type: "audio/mpeg",
//   });

//   // ── Whisper — word-level timestamps ───────────────────────────────────────
//   const transcription = await openai.audio.transcriptions.create({
//     file: audioFile,
//     model: "whisper-1",
//     language: languageCode.substring(0, 2), // ISO 639-1 two-letter code
//     response_format: "verbose_json",
//     timestamp_granularities: ["word"],
//   });

//   // ── Map segments ──────────────────────────────────────────────────────────
//   const segments: CaptionSegment[] = (transcription.segments ?? []).map(
//     (seg: any) => ({
//       text: seg.text.trim(),
//       start: seg.start,
//       end: seg.end,
//       words: (seg.words ?? []).map((w: any) => ({
//         word: w.word.trim(),
//         start: w.start,
//         end: w.end,
//       })),
//     }),
//   );

//   const duration = segments.length > 0 ? segments[segments.length - 1].end : 0;

//   const chunks = buildChunks(segments, wordsPerChunk);

//   return { segments, chunks, fullText: transcription.text, duration };
// }

// // ─── Caption Chunking ─────────────────────────────────────────────────────────

// /**
//  * Flattens all words across segments and groups them into fixed-size
//  * display chunks for animated caption overlays.
//  */
// function buildChunks(
//   segments: CaptionSegment[],
//   wordsPerChunk: number,
// ): CaptionChunk[] {
//   const allWords: CaptionWord[] = segments.flatMap((seg) => seg.words);
//   const chunks: CaptionChunk[] = [];

//   for (let i = 0; i < allWords.length; i += wordsPerChunk) {
//     const slice = allWords.slice(i, i + wordsPerChunk);
//     if (slice.length === 0) continue;
//     chunks.push({
//       text: slice.map((w) => w.word).join(" "),
//       start: slice[0].start,
//       end: slice[slice.length - 1].end,
//       words: slice,
//     });
//   }

//   return chunks;
// }

// export { buildChunks as chunkCaptions };

import { openai } from "./openai";
import { getSignedAudioUrl } from "@/lib/r2-bucket";

// ─── Types ────────────────────────────────────────────────────────────────────
//
// This shape is saved as-is to the Prisma `caption` Json field on the Video
// model, and consumed directly by the Remotion CaptionsLayer component.
// Keep it in sync with CaptionWord / CaptionData in remotion/captions-layer.tsx.

export type CaptionWord = {
  word: string;
  start: number; // seconds
  end: number; // seconds
};

export type CaptionData = {
  words: CaptionWord[];
  duration: number; // seconds — used to derive durationInFrames in Remotion
};

// ─── Caption Generation ───────────────────────────────────────────────────────

/**
 * Transcribes a voiceover audio file stored in R2 using OpenAI Whisper.
 * Returns word-level timestamps ready to be saved directly to the DB.
 *
 * The signed URL is generated internally with a 5-minute TTL and is never
 * stored anywhere — it's only used for the single fetch call below.
 */
export async function generateCaptions(
  audioR2Key: string,
  languageCode: string = "en",
): Promise<CaptionData> {
  // ── 1. Fetch audio from R2 via short-lived signed URL ─────────────────────
  const signedUrl = await getSignedAudioUrl(audioR2Key, 300); // 5-min TTL

  const audioRes = await fetch(signedUrl);
  if (!audioRes.ok) {
    throw new Error(
      `Failed to fetch audio for transcription — HTTP ${audioRes.status}`,
    );
  }

  const arrayBuffer = await audioRes.arrayBuffer();

  // OpenAI SDK accepts the Web API File object (Node 18+ / edge compatible)
  const audioFile = new File([arrayBuffer], "voiceover.mp3", {
    type: "audio/mpeg",
  });

  // ── 2. Whisper — request word-level timestamps ─────────────────────────────
  //
  // With timestamp_granularities: ["word"], Whisper returns a top-level
  // `words` array directly on the response object. Each entry looks like:
  //   { word: "The", start: 0.0, end: 0.24 }
  //
  // We do NOT request segment granularity — segment data is unused here and
  // only adds response payload size.

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: languageCode.substring(0, 2), // ISO 639-1 two-letter code
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  // ── 3. Map to clean CaptionWord array ─────────────────────────────────────
  //
  // Whisper sometimes includes leading spaces in word strings — trim them.
  // The `words` array is at the top level of the verbose_json response.

  const words: CaptionWord[] = (transcription.words ?? []).map((w: any) => ({
    word: w.word.trim(),
    start: w.start,
    end: w.end,
  }));

  // Duration = end time of the last word (more accurate than segment duration)
  const duration = words.length > 0 ? words[words.length - 1].end : 0;

  return { words, duration };
}
