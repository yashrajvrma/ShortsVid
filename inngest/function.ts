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
import {
  getSignedAudioUrl,
  getSignedUrlInBulk,
  uploadAudioToR2,
  uploadImageToR2,
  uploadVideoToR2,
} from "@/lib/r2-bucket";

import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { CaptionData, generateCaptions } from "@/lib/captions";

const fishAudio = new FishAudioClient({
  apiKey: process.env.FISH_AUDIO_API_KEY!,
});

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

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

    // // ── STEP 3: Generate per-scene image prompts (GPT-4o structured output) ──

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

    await step.run("save-captions-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          caption: captionData as CaptionData,
          duration: Math.ceil(captionData.duration),
        },
      });
    });

    // ── STEP 10: Mark video as READY ────────────────────────────────────────

    await step.run("set-status-success", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "READY" },
      });
    });

    return {
      videoId,
      imageCount: imageR2Keys.length,
      audioR2Key,
      caption: captionData,
      durationSeconds: captionData.duration,
    };
  },
);

export const renderShorts = inngest.createFunction(
  {
    id: "render-shorts",
    retries: 1,
    onFailure: async ({ event, step }) => {
      const videoId = event.data.event.data?.videoId;
      await prisma.video.update({
        where: { id: videoId },
        data: { status: "FAILED" },
      });
    },
  },

  { event: "shorts/render" },
  async ({ event, step }) => {
    const { userId, videoId } = event.data;

    // update the status to RENDERING in db
    const video = await step.run("update-status", async () => {
      const updateVideo = await prisma.video.update({
        where: { id: videoId },
        data: { status: "RENDERING" },
        include: {
          stock: true,
          captionConfig: true,
        },
      });
      return updateVideo;
    });

    // generate signedUrl for audio, music, and images
    const videoDataWithSignedUrl = await step.run(
      "generate-signed-urls",
      async () => {
        const [imagesUrl, audioUrl, backgroundMusicUrl] = await Promise.all([
          video.images.length > 0
            ? getSignedUrlInBulk(video.images)
            : Promise.resolve([] as string[]),

          video.audio ? getSignedAudioUrl(video.audio) : Promise.resolve(null),

          video.backgroundMusicId && video.stock?.r2ObjectKey
            ? getSignedAudioUrl(video.stock.r2ObjectKey)
            : Promise.resolve(null),
        ]);

        return {
          ...video,
          imagesUrl,
          audioUrl,
          backgroundMusicUrl,
        };
      },
    );

    // render shorts (audioUrl, videoUrl, captions, )
    const renderShorts = await step.run("render-shorts", async () => {
      const services = await getServices({
        region: "us-east1",
        compatibleOnly: true,
      });

      const serviceName = services[0].serviceName;

      const result = await renderMediaOnCloudrun({
        serviceName,
        region: "us-east1",
        serveUrl: process.env.GCP_SERVE_URL!,
        composition: "renderVideo",
        inputProps: {
          videoData: {
            id: videoDataWithSignedUrl.id,
            duration: videoDataWithSignedUrl.duration,
            thumbnailR2ObjectKey: videoDataWithSignedUrl.thumbnailR2ObjectKey,
            imagesUrl: videoDataWithSignedUrl.imagesUrl,
            audioUrl: videoDataWithSignedUrl.audioUrl,
            backgroundMusicUrl: videoDataWithSignedUrl.backgroundMusicUrl,
            caption: videoDataWithSignedUrl.caption,
            captionConfig: videoDataWithSignedUrl.captionConfig,
          },
        },
        codec: "h264",
      });

      if (result.type === "success") {
        console.log(result.bucketName);
        console.log(result.renderId);

        return result?.publicUrl;
      }
    });

    // upload video to cloudflare r2 using render video url
    const uploadVideo = await step.run("upload-video-to-r2", async () => {
      if (!renderShorts) {
        throw new Error("Render video failed");
      }
      const response = await fetch(renderShorts);
      const videoBuffer = Buffer.from(await response.arrayBuffer());

      const r2Key = `output/shorts/faceless/${userId}/${videoId}.mp4`;

      await uploadVideoToR2({
        buffer: videoBuffer,
        key: r2Key,
        contentType: "video/mp4",
      });

      return r2Key;
    });

    // save video and thumbnail R2 keys to DB
    await step.run("save-video-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          r2ObjectKey: uploadVideo,
          status: "SUCCESS",
        },
      });
    });

    return {
      success: true,
      message: "Shorts rendered successfully",
    };
  },
);
