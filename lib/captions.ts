import { openai } from "./openai";
import { getSignedUrl_r2 } from "@/lib/r2-bucket";

// ─── Types ───────────────────────────────────────────────────────────────────

export type CaptionWord = {
  word: string;
  start: number;
  end: number;
};

export type CaptionSegment = {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
};

export type CaptionChunk = {
  text: string;
  start: number;
  end: number;
  words: CaptionWord[];
};

export type CaptionData = {
  segments: CaptionSegment[];
  chunks: CaptionChunk[];
  fullText: string;
  duration: number;
};

// ─── Caption Generation ──────────────────────────────────────────────────────

/**
 * Accepts the R2 object key for the voiceover audio.
 * Generates a short-lived signed URL internally (never stored),
 * fetches the audio, and sends it to Whisper for word-level transcription.
 */
export async function generateCaptions(
  audioR2Key: string,
  languageCode: string = "en",
  wordsPerChunk: number = 3,
): Promise<CaptionData> {
  // Generate a short-lived signed URL — only used here, never persisted
  const signedUrl = await getSignedUrl_r2(audioR2Key, 300); // 5 min TTL

  const audioRes = await fetch(signedUrl);
  if (!audioRes.ok) {
    throw new Error(
      `Failed to fetch audio for transcription — HTTP ${audioRes.status}`,
    );
  }

  const arrayBuffer = await audioRes.arrayBuffer();

  // OpenAI SDK accepts a File object (Web API) — works in Node 18+ / edge
  const audioFile = new File([arrayBuffer], "voiceover.mp3", {
    type: "audio/mpeg",
  });

  // ── Whisper — word-level timestamps ───────────────────────────────────────
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    language: languageCode.substring(0, 2), // ISO 639-1 two-letter code
    response_format: "verbose_json",
    timestamp_granularities: ["word", "segment"],
  });

  // ── Map segments ──────────────────────────────────────────────────────────
  const segments: CaptionSegment[] = (transcription.segments ?? []).map(
    (seg: any) => ({
      text: seg.text.trim(),
      start: seg.start,
      end: seg.end,
      words: (seg.words ?? []).map((w: any) => ({
        word: w.word.trim(),
        start: w.start,
        end: w.end,
      })),
    }),
  );

  const duration = segments.length > 0 ? segments[segments.length - 1].end : 0;

  const chunks = buildChunks(segments, wordsPerChunk);

  return { segments, chunks, fullText: transcription.text, duration };
}

// ─── Caption Chunking ─────────────────────────────────────────────────────────

/**
 * Flattens all words across segments and groups them into fixed-size
 * display chunks for animated caption overlays.
 */
function buildChunks(
  segments: CaptionSegment[],
  wordsPerChunk: number,
): CaptionChunk[] {
  const allWords: CaptionWord[] = segments.flatMap((seg) => seg.words);
  const chunks: CaptionChunk[] = [];

  for (let i = 0; i < allWords.length; i += wordsPerChunk) {
    const slice = allWords.slice(i, i + wordsPerChunk);
    if (slice.length === 0) continue;
    chunks.push({
      text: slice.map((w) => w.word).join(" "),
      start: slice[0].start,
      end: slice[slice.length - 1].end,
      words: slice,
    });
  }

  return chunks;
}

export { buildChunks as chunkCaptions };
