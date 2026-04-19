import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/db";
import { inngest } from "@/inngest/client";
import { FishAudioClient } from "fish-audio";
import {
  generateImagePrompts,
  generateImageBuffer,
  type ImagePromptResult,
} from "@/lib/openai";
import {
  getSignedAudioUrl,
  getSignedUrlInBulk,
  uploadAudioToR2,
  uploadImageToR2,
  uploadVideoToR2,
  getSignedObjectUrl,
} from "@/lib/r2-bucket";
import axios from "axios";

import {
  getFunctions,
  renderMediaOnLambda,
  getRenderProgress,
} from "@remotion/lambda/client";
import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";
import { CaptionData, generateCaptions } from "@/lib/captions";
import { Topic, VideoStyle } from "@/types";
import { env } from "@/lib/env";

const fishAudio = new FishAudioClient({
  apiKey: process.env.FISH_AUDIO_API_KEY!,
  headers: {},
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

      Sentry.logger.error("Shorts generation failed", { videoId });
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

    const { characters, scenes } = await step.run(
      "generate-image-prompts",
      async (): Promise<{
        characters: { name: string; description: string }[];
        scenes: ImagePromptResult[];
      }> => {
        const result = await generateImagePrompts(
          videoData.scriptParagraphs,
          videoData.videoStyle,
          videoData.scriptTopic,
        );

        return result;
      },
    );

    Sentry.logger.info("Image prompt generated", { videoId });

    // ── STEP 4: Generate images with gpt-image-1 (medium) + upload to R2 ────

    // Saves R2 object keys (NOT URLs) ordered by sceneIndex.
    // URLs are generated on-demand at render time via presigned URLs.

    const imageR2Keys = await step.run(
      "generate-and-upload-images",
      async (): Promise<string[]> => {
        const sortedScenes = [...scenes].sort(
          (a, b) => a.sceneIndex - b.sceneIndex,
        );

        const keys: string[] = new Array(sortedScenes.length);

        // ✅ Minimal character context (clean, not noisy)
        const characterContext = characters.length
          ? characters.map((c) => `${c.name}: ${c.description}`).join("\n")
          : "";

        for (const scene of sortedScenes) {
          const enrichedPrompt = characterContext
            ? `${scene.prompt}\n\nCharacters:\n${characterContext}`
            : scene.prompt;

          const buffer = await generateImageBuffer(enrichedPrompt, scene.mood);

          const key = `shorts/${videoId}/images/scene_${scene.sceneIndex}.png`;

          await uploadImageToR2({
            buffer,
            key,
            contentType: "image/png",
          });

          keys[scene.sceneIndex] = key;
        }

        return keys;
      },
    );

    // ── STEP 5: Persist image R2 keys to DB ──────────────────────────────────

    await step.run("save-images-to-db", async () => {
      await prisma.video.update({
        where: { id: videoId },
        data: {
          images: imageR2Keys,
          thumbnailR2ObjectKey: imageR2Keys[0],
        },
      });
    });

    // ── STEP 6: Generate TTS audio via Fish Audio + upload to R2 ─────────────

    const audioR2Key = await step.run("generate-audio", async () => {
      const content = videoData.scriptParagraphs.join("\n\n");
      const key = `shorts/${videoId}/audio/voiceover.mp3`;

      const audioStream = await fishAudio.textToSpeech.convert({
        text: content,
        reference_id: videoData.voiceModelId,
        prosody: {
          speed: 1.1,
          volume: 0,
        },
      });

      Sentry.logger.info("Audio generated", { videoId });

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

    const captionData = await step.run("generate-captions", async () => {
      return generateCaptions(audioR2Key, videoData.languageCode);
    });

    Sentry.logger.info("Captions generated", { videoId });

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

    await step.run("set-status-ready", async () => {
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

export const generateConversationVideo = inngest.createFunction(
  {
    id: "generate-conversationVideo",
    retries: 2,
    timeouts: { finish: "15m" },
    onFailure: async ({ event, step }) => {
      const videoId = event.data.event.data?.videoId;

      Sentry.logger.error("Conversation video generation failed", { videoId });
      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: { status: "FAILED" },
      });
    },
  },
  { event: "conversationVideo/generate" },
  async ({ event, step }) => {
    const { userId, videoId } = event.data;

    // STEP 1: fetch video and related data from DB
    const conversationVideoData = await step.run(
      "fetch-conversationVideo-data",
      async () => {
        const conversationVideo = await prisma.conversationVideo.findUnique({
          where: {
            id: videoId,
            userId,
          },
          include: {
            script: true,
            voice1: true,
            voice2: true,
            backgroundVideo: true,
            captionConfig: true,
          },
        });

        if (!conversationVideo) {
          throw new Error(
            `Conversation video ${videoId} not found for user ${userId}`,
          );
        }
        if (!conversationVideo.script) {
          throw new Error(
            `Conversation video ${videoId} has no script attached`,
          );
        }
        if (!conversationVideo.voice1) {
          throw new Error(
            `Conversation video ${videoId} has no voice1 configured`,
          );
        }
        if (!conversationVideo.voice2) {
          throw new Error(
            `Conversation video ${videoId} has no voice2 configured`,
          );
        }

        return {
          id: conversationVideo.id,
          script: conversationVideo.script.content,
          language: conversationVideo.script.languageCode,
          backgroundVideo: conversationVideo.backgroundVideo,
          voice1ModelId: conversationVideo.voice1.modelId,
          voice2ModelId: conversationVideo.voice2.modelId,
          captionConfig: conversationVideo.captionConfig,
        };
      },
    );

    // STEP 2 : generate audio for both speakers

    // const audioR2Key = await step.run("generate-audio", async () => {
    //   const script = conversationVideoData.script;

    //   const formattedScript = script
    //     .map((line, index) => {
    //       const speaker = index % 2 === 0 ? "<|speaker:0|>" : "<|speaker:1|>";
    //       return `${speaker}${line}`;
    //     })
    //     .join("");

    //   const audioStream = await fishAudio.textToSpeech.convert({
    //     text: formattedScript,
    //     reference_id: [
    //       conversationVideoData.voice1ModelId,
    //       conversationVideoData.voice2ModelId,
    //     ],
    //     prosody: {
    //       speed: 1.1,
    //       volume: 0,
    //     },
    //   });

    //   Sentry.logger.info("Audio generated", { videoId });

    //   const key = `shorts/${videoId}/audio/voiceover.mp3`;

    //   const buffer = Buffer.from(await new Response(audioStream).arrayBuffer());
    //   await uploadAudioToR2({ buffer, key, contentType: "audio/mpeg" });

    //   return key;
    // });
    const audioR2Key = await step.run("generate-audio", async () => {
      const script = conversationVideoData.script;

      const formattedScript = script
        .map((line, index) => {
          const speaker = index % 2 === 0 ? "<|speaker:0|>" : "<|speaker:1|>";
          return `${speaker}${line}`;
        })
        .join("\n");

      const response = await axios.post(
        "https://api.fish.audio/v1/tts",
        {
          text: formattedScript,
          reference_id: [
            conversationVideoData.voice1ModelId,
            conversationVideoData.voice2ModelId,
          ],
          temperature: 0.7,
          top_p: 0.7,
          prosody: {
            speed: 1.1,
            volume: 0,
            normalize_loudness: true,
          },
          format: "mp3",
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
            "Content-Type": "application/json",
            model: "s2-pro",
          },
          responseType: "arraybuffer",
        },
      );

      Sentry.logger.info("Audio generated", { videoId });

      const key = `shorts/${videoId}/audio/voiceover.mp3`;

      const buffer = Buffer.from(response.data);

      await uploadAudioToR2({
        buffer,
        key,
        contentType: "audio/mpeg",
      });

      return key;
    });

    // STEP 3 : save it to DB
    await step.run("save-audio-to-db", async () => {
      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: { audio: audioR2Key },
      });
    });

    // STEP 4 : generate captions and save it to dB
    const captionData = await step.run("generate-captions", async () => {
      const captions = await generateCaptions(
        audioR2Key,
        conversationVideoData.language,
      );

      Sentry.logger.info("Captions generated", { videoId });

      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: {
          caption: captions as CaptionData,
          duration: Math.ceil(captions.duration),
        },
      });

      return captions;
    });

    // STEP 4: Save video thumbnail and mark video as READY
    await step.run("set-status-ready", async () => {
      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: {
          thumbnailR2ObjectKey:
            conversationVideoData.backgroundVideo.thumbnailR2ObjectKey ?? null,
          status: "READY",
        },
      });
    });

    return {
      videoId,
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

    Sentry.logger.info("Rendering started", { videoId });

    // render shorts (audioUrl, videoUrl, captions, )
    const renderShorts = await step.run("render-shorts", async () => {
      const functions = await getFunctions({
        region: "us-east-1",
        compatibleOnly: true,
      });

      const functionName = functions[0].functionName;
      console.log("all function", JSON.stringify(functions));
      console.log("function is", functionName);

      console.log("video duration is", video.duration);

      const { renderId, bucketName } = await renderMediaOnLambda({
        region: "us-east-1",
        functionName,
        serveUrl: process.env.REMOTION_AWS_SERVE_URL!,
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
        maxRetries: 1,
        framesPerLambda: 300,
        timeoutInMilliseconds: 300000, // 300seconds
      });

      while (true) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const progress = await getRenderProgress({
          renderId,
          bucketName,
          functionName,
          region: "us-east-1",
        });
        if (progress.fatalErrorEncountered) {
          // console.error("Error enountered", progress.errors);
          throw new Error("Error occurred while rendering faceless video", {
            cause: progress.errors[0],
          });
        }
        if (progress.done) {
          console.log("Render finished!", progress.outputFile);
          return progress.outputFile;
        }
      }
    });

    Sentry.logger.info("Faceless Shorts rendered successfully", { videoId });

    // upload video to cloudflare r2 using render video url
    const uploadVideo = await step.run("upload-video-to-r2", async () => {
      if (!renderShorts) {
        throw new Error("Render video failed");
      }
      const response = await fetch(renderShorts);
      const videoBuffer = Buffer.from(await response.arrayBuffer());

      const r2ObjectKey = `output/shorts/faceless/${userId}/${videoId}.mp4`;

      await uploadVideoToR2({
        buffer: videoBuffer,
        key: r2ObjectKey,
        contentType: "video/mp4",
      });

      return r2ObjectKey;
    });

    Sentry.logger.info("Shorts uploaded to r2 successfully", { videoId });
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

export const renderConversationVideo = inngest.createFunction(
  {
    id: "render-conversation-video",
    retries: 1,
    onFailure: async ({ event, step }) => {
      const videoId = event.data.event.data?.videoId;
      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: { status: "FAILED" },
      });
    },
  },

  { event: "conversationVideo/render" },
  async ({ event, step }) => {
    const { userId, videoId } = event.data;

    // update the status to RENDERING in db
    const conversationVideo = await step.run("update-status", async () => {
      const updateVideo = await prisma.conversationVideo.update({
        where: { id: videoId },
        data: { status: "RENDERING" },
        include: {
          backgroundVideo: true,
          backgroundMusic: true,
          speaker1Avatar: true,
          speaker2Avatar: true,
          captionConfig: true,
          script: true, // Needed by remotion player
        },
      });
      return updateVideo;
    });

    // generate signedUrls
    const videoDataWithSignedUrl = await step.run(
      "generate-signed-urls",
      async () => {
        const [
          speaker1AvatarUrl,
          speaker2AvatarUrl,
          audioUrl,
          backgroundVideoUrl,
          backgroundMusicUrl,
        ] = await Promise.all([
          conversationVideo.speaker1Avatar?.r2ObjectKey
            ? getSignedObjectUrl(conversationVideo.speaker1Avatar.r2ObjectKey)
            : Promise.resolve(null),
          conversationVideo.speaker2Avatar?.r2ObjectKey
            ? getSignedObjectUrl(conversationVideo.speaker2Avatar.r2ObjectKey)
            : Promise.resolve(null),
          conversationVideo.audio
            ? getSignedAudioUrl(conversationVideo.audio)
            : Promise.resolve(null),
          conversationVideo.backgroundVideo?.r2ObjectKey
            ? getSignedObjectUrl(conversationVideo.backgroundVideo.r2ObjectKey)
            : Promise.resolve(null),
          conversationVideo.backgroundMusic?.r2ObjectKey
            ? getSignedAudioUrl(conversationVideo.backgroundMusic.r2ObjectKey)
            : Promise.resolve(null),
        ]);

        return {
          ...conversationVideo,
          speaker1AvatarUrl,
          speaker2AvatarUrl,
          audioUrl,
          backgroundVideoUrl,
          backgroundMusicUrl,
        };
      },
    );

    Sentry.logger.info("Conversation video rendering started", { videoId });

    // render conversation video via CloudRun Remotion
    const renderConversationVideo = await step.run(
      "render-conversation-video",
      async () => {
        const functions = await getFunctions({
          region: "us-east-1",
          compatibleOnly: true,
        });

        console.log("video duration is", conversationVideo.duration);

        const functionName = functions[0].functionName;

        console.log("all function", JSON.stringify(functions));
        console.log("function is", functionName);

        const { renderId, bucketName } = await renderMediaOnLambda({
          region: "us-east-1",
          functionName,
          serveUrl: process.env.REMOTION_AWS_SERVE_URL!,
          composition: "renderConversationVideo",
          inputProps: {
            videoData: {
              id: videoDataWithSignedUrl.id,
              duration: videoDataWithSignedUrl.duration,
              caption: videoDataWithSignedUrl.caption,
              captionConfig: videoDataWithSignedUrl.captionConfig,
              speaker1AvatarUrl: videoDataWithSignedUrl.speaker1AvatarUrl,
              speaker2AvatarUrl: videoDataWithSignedUrl.speaker2AvatarUrl,
              audioUrl: videoDataWithSignedUrl.audioUrl,
              backgroundVideoUrl: videoDataWithSignedUrl.backgroundVideoUrl,
              backgroundMusicUrl: videoDataWithSignedUrl.backgroundMusicUrl,
              script: videoDataWithSignedUrl.script,
            },
          },
          codec: "h264",
          maxRetries: 1,
          framesPerLambda: 300,
          timeoutInMilliseconds: 300000, // 300seconds
        });

        while (true) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const progress = await getRenderProgress({
            renderId,
            bucketName,
            functionName,
            region: "us-east-1",
          });
          if (progress.fatalErrorEncountered) {
            // console.error("Error enountered", progress.errors);
            throw new Error(
              "Error occurred while rendering conversation video",
              { cause: progress.errors[0] },
            );
          }
          if (progress.done) {
            console.log("Render finished!", progress.outputFile);
            return progress.outputFile;
          }
        }
      },
    );

    Sentry.logger.info("Conversation Video rendered successfully", { videoId });

    // upload video to cloudflare r2
    const uploadVideo = await step.run("upload-video-to-r2", async () => {
      if (!renderConversationVideo) {
        throw new Error("Render conversation video failed");
      }
      const response = await fetch(renderConversationVideo);
      const videoBuffer = Buffer.from(await response.arrayBuffer());

      const r2ObjectKey = `output/shorts/conversation/${userId}/${videoId}.mp4`;

      await uploadVideoToR2({
        buffer: videoBuffer,
        key: r2ObjectKey,
        contentType: "video/mp4",
      });

      return r2ObjectKey;
    });

    Sentry.logger.info("Conversation Video uploaded to r2 successfully", {
      videoId,
    });

    // save video R2 key to DB
    await step.run("save-video-to-db", async () => {
      await prisma.conversationVideo.update({
        where: { id: videoId },
        data: {
          r2ObjectKey: uploadVideo,
          status: "SUCCESS",
        },
      });
    });

    return {
      success: true,
      message: "Conversation Video rendered successfully",
    };
  },
);

// export const renderConversationVideo = inngest.createFunction(
//   {
//     id: "render-conversation-video",
//     retries: 1,
//     onFailure: async ({ event, step }) => {
//       const videoId = event.data.event.data?.videoId;
//       await prisma.conversationVideo.update({
//         where: { id: videoId },
//         data: { status: "FAILED" },
//       });
//     },
//   },

//   { event: "conversationVideo/render" },
//   async ({ event, step }) => {
//     const { userId, videoId } = event.data;

//     // update the status to RENDERING in db
//     const conversationVideo = await step.run("update-status", async () => {
//       const updateVideo = await prisma.conversationVideo.update({
//         where: { id: videoId },
//         data: { status: "RENDERING" },
//         include: {
//           backgroundVideo: true,
//           backgroundMusic: true,
//           speaker1Avatar: true,
//           speaker2Avatar: true,
//           captionConfig: true,
//           script: true, // Needed by remotion player
//         },
//       });
//       return updateVideo;
//     });

//     // generate signedUrls
//     const videoDataWithSignedUrl = await step.run(
//       "generate-signed-urls",
//       async () => {
//         const [
//           speaker1AvatarUrl,
//           speaker2AvatarUrl,
//           audioUrl,
//           backgroundVideoUrl,
//           backgroundMusicUrl,
//         ] = await Promise.all([
//           conversationVideo.speaker1Avatar?.r2ObjectKey
//             ? getSignedObjectUrl(conversationVideo.speaker1Avatar.r2ObjectKey)
//             : Promise.resolve(null),
//           conversationVideo.speaker2Avatar?.r2ObjectKey
//             ? getSignedObjectUrl(conversationVideo.speaker2Avatar.r2ObjectKey)
//             : Promise.resolve(null),
//           conversationVideo.audio
//             ? getSignedAudioUrl(conversationVideo.audio)
//             : Promise.resolve(null),
//           conversationVideo.backgroundVideo?.r2ObjectKey
//             ? getSignedObjectUrl(conversationVideo.backgroundVideo.r2ObjectKey)
//             : Promise.resolve(null),
//           conversationVideo.backgroundMusic?.r2ObjectKey
//             ? getSignedAudioUrl(conversationVideo.backgroundMusic.r2ObjectKey)
//             : Promise.resolve(null),
//         ]);

//         return {
//           ...conversationVideo,
//           speaker1AvatarUrl,
//           speaker2AvatarUrl,
//           audioUrl,
//           backgroundVideoUrl,
//           backgroundMusicUrl,
//         };
//       },
//     );

//     Sentry.logger.info("Conversation video rendering started", { videoId });

//     // render conversation video via CloudRun Remotion
//     const renderConversationVideo = await step.run(
//       "render-conversation-video",
//       async () => {
//         const services = await getServices({
//           region: "us-east1",
//           compatibleOnly: true,
//         });

//         console.log("video duration is", conversationVideo.duration);

//         const serviceName = services[0].serviceName;

//         const result = await renderMediaOnCloudrun({
//           serviceName,
//           region: "us-east1",
//           serveUrl: process.env.GCP_SERVE_URL!,
//           composition: "renderConversationVideo",
//           inputProps: {
//             videoData: {
//               id: videoDataWithSignedUrl.id,
//               duration: videoDataWithSignedUrl.duration,
//               caption: videoDataWithSignedUrl.caption,
//               captionConfig: videoDataWithSignedUrl.captionConfig,
//               speaker1AvatarUrl: videoDataWithSignedUrl.speaker1AvatarUrl,
//               speaker2AvatarUrl: videoDataWithSignedUrl.speaker2AvatarUrl,
//               audioUrl: videoDataWithSignedUrl.audioUrl,
//               backgroundVideoUrl: videoDataWithSignedUrl.backgroundVideoUrl,
//               backgroundMusicUrl: videoDataWithSignedUrl.backgroundMusicUrl,
//               script: videoDataWithSignedUrl.script,
//             },
//           },
//           codec: "h264",
//         });

//         if (result.type === "success") {
//           console.log(result.bucketName);
//           console.log(result.renderId);

//           return result?.publicUrl;
//         }
//       },
//     );

//     Sentry.logger.info("Conversation Video rendered successfully", { videoId });

//     // upload video to cloudflare r2
//     const uploadVideo = await step.run("upload-video-to-r2", async () => {
//       if (!renderConversationVideo) {
//         throw new Error("Render conversation video failed");
//       }
//       const response = await fetch(renderConversationVideo);
//       const videoBuffer = Buffer.from(await response.arrayBuffer());

//       const r2ObjectKey = `output/shorts/conversation/${userId}/${videoId}.mp4`;

//       await uploadVideoToR2({
//         buffer: videoBuffer,
//         key: r2ObjectKey,
//         contentType: "video/mp4",
//       });

//       return r2ObjectKey;
//     });

//     Sentry.logger.info("Conversation Video uploaded to r2 successfully", {
//       videoId,
//     });

//     // save video R2 key to DB
//     await step.run("save-video-to-db", async () => {
//       await prisma.conversationVideo.update({
//         where: { id: videoId },
//         data: {
//           r2ObjectKey: uploadVideo,
//           status: "SUCCESS",
//         },
//       });
//     });

//     return {
//       success: true,
//       message: "Conversation Video rendered successfully",
//     };
//   },
// );
