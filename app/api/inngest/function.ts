import { prisma } from "@/db";
import { inngest } from "@/inngest/client";
import { FishAudioClient } from "fish-audio";
import {
  generateImagePrompts,
  generateImageBuffer,
  type ImagePromptResult,
  type Topic,
  type VideoStyle,
} from "@/lib/openai";
import { generateCaptions } from "@/lib/captions";
import { uploadAudioToR2, uploadImageToR2 } from "@/lib/r2-bucket";

// ─── Fish Audio Client ───────────────────────────────────────────────────────

const fishAudio = new FishAudioClient({
  apiKey: process.env.FISH_AUDIO_API_KEY!,
});

// ─── Hello World (dev/test) ───────────────────────────────────────────────────

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// ─── Generate Short Video ────────────────────────────────────────────────────

export const generateShort = inngest.createFunction(
  {
    id: "generate-short",
    retries: 2,
    timeouts: { finish: "15m" },
    onFailure: async ({ event, step }) => {
      const videoId = event.data.event.data?.videoId;
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "FAILED" },
      });
    },
  },
  { event: "shorts/generate" },
  async ({ event, step }) => {
    const { userId, videoId } = event.data;

    // ── STEP 1: Fetch video + related data from DB ───────────────────────────

    const videoData = await step.run("fetch-video-data", async () => {
      const video = await prisma.video.findUnique({
        where: { id: videoId, userId },
        include: {
          script: true,
          voice: true,
          stock: true,
          captionConfig: true,
        },
      });

      if (!video)
        throw new Error(`Video ${videoId} not found for user ${userId}`);
      if (!video.script)
        throw new Error(`Video ${videoId} has no script attached`);
      if (!video.voice)
        throw new Error(`Video ${videoId} has no voice configured`);

      return {
        id: video.id,
        videoStyle: video.videoStyle as VideoStyle,
        scriptParagraphs: video.script.content as string[],
        scriptTopic: video.script.topic as Topic,
        languageCode: video.script.languageCode,
        voiceModelId: video.voice.modelId,
        captionConfig: video.captionConfig,
      };
    });

    // ── STEP 2: Mark as PROCESSING ───────────────────────────────────────────

    // await step.run("set-status-processing", async () => {
    //   await prisma.video.update({
    //     where: { id: videoId },
    //     data: { status: "PROCESSING" },
    //   });
    // });

    // ── STEP 3: Generate per-scene image prompts (GPT-4o structured output) ──

    const imagePrompts = await step.run(
      "generate-image-prompts",
      async (): Promise<ImagePromptResult[]> => {
        return generateImagePrompts(
          videoData.scriptParagraphs,
          videoData.videoStyle,
          videoData.scriptTopic,
        );
      },
    );

    // ── STEP 4: Generate images with gpt-image-1 (medium) + upload to R2 ────
    //
    // Saves R2 object keys (NOT URLs) ordered by sceneIndex.
    // URLs are generated on-demand at render time via presigned URLs.

    const imageR2Keys = await step.run(
      "generate-and-upload-images",
      async (): Promise<string[]> => {
        const sorted = [...imagePrompts].sort(
          (a, b) => a.sceneIndex - b.sceneIndex,
        );

        const keys: string[] = [];

        // TODO : send all the req parallely

        for (const scene of sorted) {
          const key = `videos/${videoId}/images/scene_${scene.sceneIndex}.png`;
          const buffer = await generateImageBuffer(scene.prompt, scene.mood);
          await uploadImageToR2({ buffer, key, contentType: "image/png" });
          // Store the R2 key at the exact sceneIndex position
          keys[scene.sceneIndex] = key;
        }

        return keys;
      },
    );

    // ── STEP 5: Persist image R2 keys to DB ──────────────────────────────────

    await step.run("save-images-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        // images: String[] in schema — stores R2 object keys
        data: { images: imageR2Keys },
      });
    });

    // ── STEP 6: Generate TTS audio via Fish Audio + upload to R2 ─────────────

    const audioR2Key = await step.run("generate-audio", async () => {
      const content = videoData.scriptParagraphs.join("\n\n");
      const key = `videos/${videoId}/audio/voiceover.mp3`;

      const audioStream = await fishAudio.textToSpeech.convert({
        text: content,
        reference_id: videoData.voiceModelId,
      });

      const buffer = Buffer.from(await new Response(audioStream).arrayBuffer());
      await uploadAudioToR2({ buffer, key, contentType: "audio/mpeg" });

      // Return R2 key — NOT a URL
      return key;
    });

    // ── STEP 7: Persist audio R2 key to DB ───────────────────────────────────

    await step.run("save-audio-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        // audio: String? in schema — stores R2 object key
        data: { audio: audioR2Key },
      });
    });

    // ── STEP 8: Generate word-level captions via Whisper ─────────────────────
    //
    // generateCaptions receives the R2 key and internally generates a
    // short-lived signed URL to fetch the audio. That signed URL is
    // never stored anywhere.

    const captionData = await step.run("generate-captions", async () => {
      return generateCaptions(audioR2Key, videoData.languageCode);
    });

    // ── STEP 9: Persist captions + audio duration to DB ──────────────────────

    await step.run("save-captions-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          caption: captionData as any, // Prisma Json field
          duration: Math.ceil(captionData.duration),
        },
      });
    });

    // ── STEP 10: Mark video as SUCCESS ────────────────────────────────────────

    await step.run("set-status-success", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "SUCCESS" },
      });
    });

    return {
      videoId,
      imageCount: imageR2Keys.length,
      audioR2Key,
      captionSegments: captionData.segments.length,
      durationSeconds: captionData.duration,
    };
  },
);
