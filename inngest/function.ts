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
  uploadAudioToR2,
  uploadImageToR2,
  uploadVideoToR2,
} from "@/lib/r2-bucket";

import { getServices, renderMediaOnCloudrun } from "@remotion/cloudrun/client";

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

    // const videoData = await step.run("fetch-video-data", async () => {
    //   const video = await prisma.video.findUnique({
    //     where: { id: videoId, userId },
    //     include: {
    //       script: true,
    //       voice: true,
    //       stock: true,
    //       captionConfig: true,
    //     },
    //   });

    //   if (!video)
    //     throw new Error(`Video ${videoId} not found for user ${userId}`);
    //   if (!video.script)
    //     throw new Error(`Video ${videoId} has no script attached`);
    //   if (!video.voice)
    //     throw new Error(`Video ${videoId} has no voice configured`);

    //   return {
    //     id: video.id,
    //     videoStyle: video.videoStyle as VideoStyle,
    //     scriptParagraphs: video.script.content as string[],
    //     scriptTopic: video.script.topic as Topic,
    //     languageCode: video.script.languageCode,
    //     voiceModelId: video.voice.modelId,
    //     captionConfig: video.captionConfig,
    //   };
    // });



    // // ── STEP 3: Generate per-scene image prompts (GPT-4o structured output) ──

    // const imagePrompts = await step.run(
    //   "generate-image-prompts",
    //   async (): Promise<ImagePromptResult[]> => {
    //     return generateImagePrompts(
    //       videoData.scriptParagraphs,
    //       videoData.videoStyle,
    //       videoData.scriptTopic,
    //     );
    //   },
    // );

    // // ── STEP 4: Generate images with gpt-image-1 (medium) + upload to R2 ────
    // //
    // // Saves R2 object keys (NOT URLs) ordered by sceneIndex.
    // // URLs are generated on-demand at render time via presigned URLs.

    // const imageR2Keys = await step.run(
    //   "generate-and-upload-images",
    //   async (): Promise<string[]> => {
    //     const sorted = [...imagePrompts].sort(
    //       (a, b) => a.sceneIndex - b.sceneIndex,
    //     );

    //     const keys: string[] = [];

    //     // TODO : send all the req parallely

    //     for (const scene of sorted) {
    //       const key = `videos/${videoId}/images/scene_${scene.sceneIndex}.png`;
    //       const buffer = await generateImageBuffer(scene.prompt, scene.mood);
    //       await uploadImageToR2({ buffer, key, contentType: "image/png" });
    //       // Store the R2 key at the exact sceneIndex position
    //       keys[scene.sceneIndex] = key;
    //     }

    //     return keys;
    //   },
    // );

    // // ── STEP 5: Persist image R2 keys to DB ──────────────────────────────────

    // await step.run("save-images-to-db", async () => {
    //   await prisma.video.update({
    //     where: { id: videoId },
    //     // images: String[] in schema — stores R2 object keys
    //     data: { images: imageR2Keys },
    //   });
    // });

    // // ── STEP 6: Generate TTS audio via Fish Audio + upload to R2 ─────────────

    // const audioR2Key = await step.run("generate-audio", async () => {
    //   const content = videoData.scriptParagraphs.join("\n\n");
    //   const key = `videos/${videoId}/audio/voiceover.mp3`;

    //   const audioStream = await fishAudio.textToSpeech.convert({
    //     text: content,
    //     reference_id: videoData.voiceModelId,
    //   });

    //   const buffer = Buffer.from(await new Response(audioStream).arrayBuffer());
    //   await uploadAudioToR2({ buffer, key, contentType: "audio/mpeg" });

    //   // Return R2 key — NOT a URL
    //   return key;
    // });

    // // ── STEP 7: Persist audio R2 key to DB ───────────────────────────────────

    // await step.run("save-audio-to-db", async () => {
    //   await prisma.video.update({
    //     where: { id: videoId },
    //     // audio: String? in schema — stores R2 object key
    //     data: { audio: audioR2Key },
    //   });
    // });

    // // ── STEP 8: Generate word-level captions via Whisper ─────────────────────
    // //
    // // generateCaptions receives the R2 key and internally generates a
    // // short-lived signed URL to fetch the audio. That signed URL is
    // // never stored anywhere.

    // const captionData = await step.run("generate-captions", async () => {
    //   return generateCaptions(audioR2Key, videoData.languageCode);
    //   // ↑ no more wordsPerChunk arg needed
    // });

    // await step.run("save-captions-to-db", async () => {
    //   await prisma.video.update({
    //     where: { id: videoId },
    //     data: {
    //       caption: captionData as CaptionData,
    //       duration: Math.ceil(captionData.duration),
    //     },
    //   });
    // });

    // // ── STEP 10: Mark video as SUCCESS ────────────────────────────────────────

    // await step.run("set-status-success", async () => {
    //   await prisma.video.update({
    //     where: { id: videoId },
    //     data: { status: "SUCCESS" },
    //   });
    // });

    // Render video
    const renderVideo = await step.run("render-video", async () => {
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
            id: "cmmo310z9000drsl96wk8xl81",
            userId: "IBeZWPANnFLz6bBGq4Q6EMeuvA55PhHN",
            videoStyle: "CINEMATIC",
            duration: 63,
            status: "SUCCESS",
            scriptId: "cmmo310j3000brsl9r4tzo0r8",
            voiceId: "cmmib8b910003dcl9i3kv5tm7",
            captionConfigId: null,
            backgroundMusicId: null,
            images: [
              "videos/cmmo310z9000drsl96wk8xl81/images/scene_0.png",
              "videos/cmmo310z9000drsl96wk8xl81/images/scene_1.png",
              "videos/cmmo310z9000drsl96wk8xl81/images/scene_2.png",
              "videos/cmmo310z9000drsl96wk8xl81/images/scene_3.png",
              "videos/cmmo310z9000drsl96wk8xl81/images/scene_4.png",
            ],
            audio: "videos/cmmo310z9000drsl96wk8xl81/audio/voiceover.mp3",
            caption: {
              task: "transcribe",
              text: "Did you know that Cleopatra, the last active ruler of the Ptolemaic Kingdom of Egypt, was not actually Egyptian? Despite being one of the most famous figures in ancient Egyptian history, she was of Macedonian Greek descent. Fascinating, right? Now how about this? During the Middle Ages, there existed a peculiar law known as trial by ordeal. Accused of a crime? You might have had to grab a red-hot iron bar and prove your innocence by surviving unscathed. Talk about a heated trial. Another intriguing fact, the Great Wall of China isn't a single continuous wall. Rather, it's a series of walls and fortifications, some parts dating back as far as the 7th century BC. Quite the ancient jigsaw puzzle. And here's a spicy one. Ketchup was originally sold as medicine in the 1830s. It was believed to cure ailments like indigestion. Next time you reach for that bottle, remember its curious past. Lastly, did you know that Napoleon Bonaparte wasn't actually short? At around 5'7 he was average height for a man of his time. Perceptions really do matter in history. Keep questioning what you've been told.",
              usage: {
                type: "duration",
                seconds: 63,
              },
              words: [
                {
                  end: 0.36000001430511475,
                  word: "Did",
                  start: 0,
                },
                {
                  end: 0.5,
                  word: "you",
                  start: 0.36000001430511475,
                },
                {
                  end: 0.6399999856948853,
                  word: "know",
                  start: 0.5,
                },
                {
                  end: 0.8799999952316284,
                  word: "that",
                  start: 0.6399999856948853,
                },
                {
                  end: 1.4199999570846558,
                  word: "Cleopatra",
                  start: 0.8799999952316284,
                },
                {
                  end: 2.0199999809265137,
                  word: "the",
                  start: 1.8600000143051147,
                },
                {
                  end: 2.319999933242798,
                  word: "last",
                  start: 2.0199999809265137,
                },
                {
                  end: 2.740000009536743,
                  word: "active",
                  start: 2.319999933242798,
                },
                {
                  end: 2.9600000381469727,
                  word: "ruler",
                  start: 2.740000009536743,
                },
                {
                  end: 3.140000104904175,
                  word: "of",
                  start: 2.9600000381469727,
                },
                {
                  end: 3.440000057220459,
                  word: "the",
                  start: 3.140000104904175,
                },
                {
                  end: 3.759999990463257,
                  word: "Ptolemaic",
                  start: 3.440000057220459,
                },
                {
                  end: 4.019999980926514,
                  word: "Kingdom",
                  start: 3.759999990463257,
                },
                {
                  end: 4.519999980926514,
                  word: "of",
                  start: 4.019999980926514,
                },
                {
                  end: 4.519999980926514,
                  word: "Egypt",
                  start: 4.519999980926514,
                },
                {
                  end: 5.019999980926514,
                  word: "was",
                  start: 4.880000114440918,
                },
                {
                  end: 5.239999771118164,
                  word: "not",
                  start: 5.019999980926514,
                },
                {
                  end: 5.78000020980835,
                  word: "actually",
                  start: 5.239999771118164,
                },
                {
                  end: 6.119999885559082,
                  word: "Egyptian",
                  start: 5.78000020980835,
                },
                {
                  end: 7.019999980926514,
                  word: "Despite",
                  start: 6.760000228881836,
                },
                {
                  end: 7.320000171661377,
                  word: "being",
                  start: 7.019999980926514,
                },
                {
                  end: 7.460000038146973,
                  word: "one",
                  start: 7.320000171661377,
                },
                {
                  end: 7.559999942779541,
                  word: "of",
                  start: 7.460000038146973,
                },
                {
                  end: 7.679999828338623,
                  word: "the",
                  start: 7.559999942779541,
                },
                {
                  end: 8.260000228881836,
                  word: "most",
                  start: 7.679999828338623,
                },
                {
                  end: 8.260000228881836,
                  word: "famous",
                  start: 8.260000228881836,
                },
                {
                  end: 8.600000381469727,
                  word: "figures",
                  start: 8.260000228881836,
                },
                {
                  end: 8.880000114440918,
                  word: "in",
                  start: 8.600000381469727,
                },
                {
                  end: 9.220000267028809,
                  word: "ancient",
                  start: 8.880000114440918,
                },
                {
                  end: 9.640000343322754,
                  word: "Egyptian",
                  start: 9.220000267028809,
                },
                {
                  end: 9.979999542236328,
                  word: "history",
                  start: 9.640000343322754,
                },
                {
                  end: 10.539999961853027,
                  word: "she",
                  start: 10.4399995803833,
                },
                {
                  end: 10.720000267028809,
                  word: "was",
                  start: 10.539999961853027,
                },
                {
                  end: 10.9399995803833,
                  word: "of",
                  start: 10.720000267028809,
                },
                {
                  end: 11.539999961853027,
                  word: "Macedonian",
                  start: 10.9399995803833,
                },
                {
                  end: 12.039999961853027,
                  word: "Greek",
                  start: 11.539999961853027,
                },
                {
                  end: 12.319999694824219,
                  word: "descent",
                  start: 12.039999961853027,
                },
                {
                  end: 13.260000228881836,
                  word: "Fascinating",
                  start: 12.9399995803833,
                },
                {
                  end: 13.600000381469727,
                  word: "right",
                  start: 13.300000190734863,
                },
                {
                  end: 14.220000267028809,
                  word: "Now",
                  start: 13.819999694824219,
                },
                {
                  end: 14.420000076293945,
                  word: "how",
                  start: 14.220000267028809,
                },
                {
                  end: 14.640000343322754,
                  word: "about",
                  start: 14.420000076293945,
                },
                {
                  end: 14.979999542236328,
                  word: "this",
                  start: 14.640000343322754,
                },
                {
                  end: 15.600000381469727,
                  word: "During",
                  start: 15.600000381469727,
                },
                {
                  end: 15.800000190734863,
                  word: "the",
                  start: 15.600000381469727,
                },
                {
                  end: 15.979999542236328,
                  word: "Middle",
                  start: 15.800000190734863,
                },
                {
                  end: 16.260000228881836,
                  word: "Ages",
                  start: 15.979999542236328,
                },
                {
                  end: 16.719999313354492,
                  word: "there",
                  start: 16.600000381469727,
                },
                {
                  end: 17.079999923706055,
                  word: "existed",
                  start: 16.719999313354492,
                },
                {
                  end: 17.31999969482422,
                  word: "a",
                  start: 17.079999923706055,
                },
                {
                  end: 17.700000762939453,
                  word: "peculiar",
                  start: 17.31999969482422,
                },
                {
                  end: 18.139999389648438,
                  word: "law",
                  start: 17.700000762939453,
                },
                {
                  end: 18.5,
                  word: "known",
                  start: 18.139999389648438,
                },
                {
                  end: 18.799999237060547,
                  word: "as",
                  start: 18.5,
                },
                {
                  end: 19.040000915527344,
                  word: "trial",
                  start: 18.799999237060547,
                },
                {
                  end: 19.31999969482422,
                  word: "by",
                  start: 19.040000915527344,
                },
                {
                  end: 19.739999771118164,
                  word: "ordeal",
                  start: 19.31999969482422,
                },
                {
                  end: 20.65999984741211,
                  word: "Accused",
                  start: 20.31999969482422,
                },
                {
                  end: 20.739999771118164,
                  word: "of",
                  start: 20.65999984741211,
                },
                {
                  end: 21.15999984741211,
                  word: "a",
                  start: 20.739999771118164,
                },
                {
                  end: 21.15999984741211,
                  word: "crime",
                  start: 21.15999984741211,
                },
                {
                  end: 21.760000228881836,
                  word: "You",
                  start: 21.540000915527344,
                },
                {
                  end: 21.899999618530273,
                  word: "might",
                  start: 21.760000228881836,
                },
                {
                  end: 22.020000457763672,
                  word: "have",
                  start: 21.899999618530273,
                },
                {
                  end: 22.15999984741211,
                  word: "had",
                  start: 22.020000457763672,
                },
                {
                  end: 22.479999542236328,
                  word: "to",
                  start: 22.15999984741211,
                },
                {
                  end: 22.479999542236328,
                  word: "grab",
                  start: 22.479999542236328,
                },
                {
                  end: 22.639999389648438,
                  word: "a",
                  start: 22.479999542236328,
                },
                {
                  end: 22.979999542236328,
                  word: "red",
                  start: 22.639999389648438,
                },
                {
                  end: 23.040000915527344,
                  word: "hot",
                  start: 22.979999542236328,
                },
                {
                  end: 23.360000610351562,
                  word: "iron",
                  start: 23.040000915527344,
                },
                {
                  end: 23.639999389648438,
                  word: "bar",
                  start: 23.360000610351562,
                },
                {
                  end: 24.100000381469727,
                  word: "and",
                  start: 23.639999389648438,
                },
                {
                  end: 24.280000686645508,
                  word: "prove",
                  start: 24.100000381469727,
                },
                {
                  end: 24.479999542236328,
                  word: "your",
                  start: 24.280000686645508,
                },
                {
                  end: 24.780000686645508,
                  word: "innocence",
                  start: 24.479999542236328,
                },
                {
                  end: 25.079999923706055,
                  word: "by",
                  start: 24.780000686645508,
                },
                {
                  end: 25.5,
                  word: "surviving",
                  start: 25.079999923706055,
                },
                {
                  end: 26.18000030517578,
                  word: "unscathed",
                  start: 25.5,
                },
                {
                  end: 26.799999237060547,
                  word: "Talk",
                  start: 26.68000030517578,
                },
                {
                  end: 27.020000457763672,
                  word: "about",
                  start: 26.799999237060547,
                },
                {
                  end: 27.239999771118164,
                  word: "a",
                  start: 27.020000457763672,
                },
                {
                  end: 27.420000076293945,
                  word: "heated",
                  start: 27.239999771118164,
                },
                {
                  end: 27.81999969482422,
                  word: "trial",
                  start: 27.420000076293945,
                },
                {
                  end: 28.540000915527344,
                  word: "Another",
                  start: 28.34000015258789,
                },
                {
                  end: 28.940000534057617,
                  word: "intriguing",
                  start: 28.540000915527344,
                },
                {
                  end: 29.31999969482422,
                  word: "fact",
                  start: 28.940000534057617,
                },
                {
                  end: 29.799999237060547,
                  word: "the",
                  start: 29.719999313354492,
                },
                {
                  end: 30.15999984741211,
                  word: "Great",
                  start: 29.799999237060547,
                },
                {
                  end: 30.239999771118164,
                  word: "Wall",
                  start: 30.15999984741211,
                },
                {
                  end: 30.459999084472656,
                  word: "of",
                  start: 30.239999771118164,
                },
                {
                  end: 30.760000228881836,
                  word: "China",
                  start: 30.459999084472656,
                },
                {
                  end: 31.1200008392334,
                  word: "isn't",
                  start: 30.760000228881836,
                },
                {
                  end: 31.31999969482422,
                  word: "a",
                  start: 31.1200008392334,
                },
                {
                  end: 31.65999984741211,
                  word: "single",
                  start: 31.31999969482422,
                },
                {
                  end: 32.220001220703125,
                  word: "continuous",
                  start: 31.65999984741211,
                },
                {
                  end: 32.47999954223633,
                  word: "wall",
                  start: 32.220001220703125,
                },
                {
                  end: 33.2400016784668,
                  word: "Rather",
                  start: 32.959999084472656,
                },
                {
                  end: 33.720001220703125,
                  word: "it's",
                  start: 33.400001525878906,
                },
                {
                  end: 33.959999084472656,
                  word: "a",
                  start: 33.720001220703125,
                },
                {
                  end: 34.119998931884766,
                  word: "series",
                  start: 33.959999084472656,
                },
                {
                  end: 34.599998474121094,
                  word: "of",
                  start: 34.119998931884766,
                },
                {
                  end: 34.599998474121094,
                  word: "walls",
                  start: 34.599998474121094,
                },
                {
                  end: 34.779998779296875,
                  word: "and",
                  start: 34.599998474121094,
                },
                {
                  end: 35.380001068115234,
                  word: "fortifications",
                  start: 34.779998779296875,
                },
                {
                  end: 36.099998474121094,
                  word: "some",
                  start: 35.880001068115234,
                },
                {
                  end: 36.36000061035156,
                  word: "parts",
                  start: 36.099998474121094,
                },
                {
                  end: 36.560001373291016,
                  word: "dating",
                  start: 36.36000061035156,
                },
                {
                  end: 36.900001525878906,
                  word: "back",
                  start: 36.560001373291016,
                },
                {
                  end: 37.2400016784668,
                  word: "as",
                  start: 36.900001525878906,
                },
                {
                  end: 37.2400016784668,
                  word: "far",
                  start: 37.2400016784668,
                },
                {
                  end: 37.36000061035156,
                  word: "as",
                  start: 37.2400016784668,
                },
                {
                  end: 37.58000183105469,
                  word: "the",
                  start: 37.36000061035156,
                },
                {
                  end: 37.86000061035156,
                  word: "7th",
                  start: 37.58000183105469,
                },
                {
                  end: 38.15999984741211,
                  word: "century",
                  start: 37.86000061035156,
                },
                {
                  end: 38.65999984741211,
                  word: "BC",
                  start: 38.15999984741211,
                },
                {
                  end: 39.34000015258789,
                  word: "Quite",
                  start: 39.20000076293945,
                },
                {
                  end: 39.540000915527344,
                  word: "the",
                  start: 39.34000015258789,
                },
                {
                  end: 39.86000061035156,
                  word: "ancient",
                  start: 39.540000915527344,
                },
                {
                  end: 40.279998779296875,
                  word: "jigsaw",
                  start: 39.86000061035156,
                },
                {
                  end: 40.540000915527344,
                  word: "puzzle",
                  start: 40.279998779296875,
                },
                {
                  end: 41.20000076293945,
                  word: "And",
                  start: 41.060001373291016,
                },
                {
                  end: 41.380001068115234,
                  word: "here's",
                  start: 41.20000076293945,
                },
                {
                  end: 41.599998474121094,
                  word: "a",
                  start: 41.380001068115234,
                },
                {
                  end: 41.84000015258789,
                  word: "spicy",
                  start: 41.599998474121094,
                },
                {
                  end: 42.119998931884766,
                  word: "one",
                  start: 41.84000015258789,
                },
                {
                  end: 42.779998779296875,
                  word: "Ketchup",
                  start: 42.779998779296875,
                },
                {
                  end: 43.040000915527344,
                  word: "was",
                  start: 42.779998779296875,
                },
                {
                  end: 43.540000915527344,
                  word: "originally",
                  start: 43.040000915527344,
                },
                {
                  end: 43.7599983215332,
                  word: "sold",
                  start: 43.540000915527344,
                },
                {
                  end: 44.02000045776367,
                  word: "as",
                  start: 43.7599983215332,
                },
                {
                  end: 44.279998779296875,
                  word: "medicine",
                  start: 44.02000045776367,
                },
                {
                  end: 44.47999954223633,
                  word: "in",
                  start: 44.279998779296875,
                },
                {
                  end: 44.599998474121094,
                  word: "the",
                  start: 44.47999954223633,
                },
                {
                  end: 45.34000015258789,
                  word: "1830s",
                  start: 44.599998474121094,
                },
                {
                  end: 45.81999969482422,
                  word: "It",
                  start: 45.68000030517578,
                },
                {
                  end: 46.040000915527344,
                  word: "was",
                  start: 45.81999969482422,
                },
                {
                  end: 46.2400016784668,
                  word: "believed",
                  start: 46.040000915527344,
                },
                {
                  end: 46.540000915527344,
                  word: "to",
                  start: 46.2400016784668,
                },
                {
                  end: 46.619998931884766,
                  word: "cure",
                  start: 46.540000915527344,
                },
                {
                  end: 47.040000915527344,
                  word: "ailments",
                  start: 46.619998931884766,
                },
                {
                  end: 47.36000061035156,
                  word: "like",
                  start: 47.040000915527344,
                },
                {
                  end: 48.02000045776367,
                  word: "indigestion",
                  start: 47.36000061035156,
                },
                {
                  end: 48.7400016784668,
                  word: "Next",
                  start: 48.540000915527344,
                },
                {
                  end: 48.900001525878906,
                  word: "time",
                  start: 48.7400016784668,
                },
                {
                  end: 49.08000183105469,
                  word: "you",
                  start: 48.900001525878906,
                },
                {
                  end: 49.220001220703125,
                  word: "reach",
                  start: 49.08000183105469,
                },
                {
                  end: 49.380001068115234,
                  word: "for",
                  start: 49.220001220703125,
                },
                {
                  end: 49.599998474121094,
                  word: "that",
                  start: 49.380001068115234,
                },
                {
                  end: 49.84000015258789,
                  word: "bottle",
                  start: 49.599998474121094,
                },
                {
                  end: 50.439998626708984,
                  word: "remember",
                  start: 50.2400016784668,
                },
                {
                  end: 50.65999984741211,
                  word: "its",
                  start: 50.439998626708984,
                },
                {
                  end: 51.02000045776367,
                  word: "curious",
                  start: 50.65999984741211,
                },
                {
                  end: 51.47999954223633,
                  word: "past",
                  start: 51.02000045776367,
                },
                {
                  end: 52.34000015258789,
                  word: "Lastly",
                  start: 51.47999954223633,
                },
                {
                  end: 52.84000015258789,
                  word: "did",
                  start: 52.81999969482422,
                },
                {
                  end: 52.97999954223633,
                  word: "you",
                  start: 52.84000015258789,
                },
                {
                  end: 53.119998931884766,
                  word: "know",
                  start: 52.97999954223633,
                },
                {
                  end: 53.31999969482422,
                  word: "that",
                  start: 53.119998931884766,
                },
                {
                  end: 53.7400016784668,
                  word: "Napoleon",
                  start: 53.31999969482422,
                },
                {
                  end: 54.20000076293945,
                  word: "Bonaparte",
                  start: 53.7400016784668,
                },
                {
                  end: 54.599998474121094,
                  word: "wasn't",
                  start: 54.20000076293945,
                },
                {
                  end: 55.13999938964844,
                  word: "actually",
                  start: 54.599998474121094,
                },
                {
                  end: 55.439998626708984,
                  word: "short",
                  start: 55.13999938964844,
                },
                {
                  end: 55.880001068115234,
                  word: "At",
                  start: 55.79999923706055,
                },
                {
                  end: 56.13999938964844,
                  word: "around",
                  start: 55.880001068115234,
                },
                {
                  end: 56.47999954223633,
                  word: "5",
                  start: 56.13999938964844,
                },
                {
                  end: 56.65999984741211,
                  word: "7",
                  start: 56.47999954223633,
                },
                {
                  end: 56.81999969482422,
                  word: "he",
                  start: 56.65999984741211,
                },
                {
                  end: 57,
                  word: "was",
                  start: 56.81999969482422,
                },
                {
                  end: 57.279998779296875,
                  word: "average",
                  start: 57,
                },
                {
                  end: 57.540000915527344,
                  word: "height",
                  start: 57.279998779296875,
                },
                {
                  end: 57.70000076293945,
                  word: "for",
                  start: 57.540000915527344,
                },
                {
                  end: 57.900001525878906,
                  word: "a",
                  start: 57.70000076293945,
                },
                {
                  end: 57.939998626708984,
                  word: "man",
                  start: 57.900001525878906,
                },
                {
                  end: 58.060001373291016,
                  word: "of",
                  start: 57.939998626708984,
                },
                {
                  end: 58.20000076293945,
                  word: "his",
                  start: 58.060001373291016,
                },
                {
                  end: 58.52000045776367,
                  word: "time",
                  start: 58.20000076293945,
                },
                {
                  end: 59.380001068115234,
                  word: "Perceptions",
                  start: 59.040000915527344,
                },
                {
                  end: 59.7599983215332,
                  word: "really",
                  start: 59.380001068115234,
                },
                {
                  end: 60.220001220703125,
                  word: "do",
                  start: 59.7599983215332,
                },
                {
                  end: 60.220001220703125,
                  word: "matter",
                  start: 60.220001220703125,
                },
                {
                  end: 60.459999084472656,
                  word: "in",
                  start: 60.220001220703125,
                },
                {
                  end: 60.720001220703125,
                  word: "history",
                  start: 60.459999084472656,
                },
                {
                  end: 61.34000015258789,
                  word: "Keep",
                  start: 61.2599983215332,
                },
                {
                  end: 61.7400016784668,
                  word: "questioning",
                  start: 61.34000015258789,
                },
                {
                  end: 62,
                  word: "what",
                  start: 61.7400016784668,
                },
                {
                  end: 62.20000076293945,
                  word: "you've",
                  start: 62,
                },
                {
                  end: 62.34000015258789,
                  word: "been",
                  start: 62.20000076293945,
                },
                {
                  end: 62.599998474121094,
                  word: "told",
                  start: 62.34000015258789,
                },
              ],
              duration: 62.95000076293945,
              language: "english",
            },
            thumbnailR2ObjectKey: null,
            r2ObjectKey: null,
            createdAt: "2026-03-12T23:11:36.500Z",
            updatedAt: "2026-03-12T23:14:35.078Z",
            captionConfig: null,
            stock: null,
            imagesUrl: [
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/images/scene_0.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=48d4bdf5eb699031d085eece914686e1a38da6f1994af5ff3066cc2c7bf59776&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/images/scene_1.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=0787f2e2c9ddcc0c0aae924eba34e2935533bb52eda92143c0d96f3f2f1722b0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/images/scene_2.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=e3dfa4820df09cc665226df12bc51a3f0afe88956f8420f4aeed85219afdb433&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/images/scene_3.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=85618778100c3b316eff53389cf305dc7113ac4c01f8373c974fc67ed11e60ca&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/images/scene_4.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=4833006245ecadc40a066d6889d9d0c40fc097274c96bde401b99194e90f4c35&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
            ],
            audioUrl:
              "https://shortsvid-dev.dd25622537be75e48de1c853bb4087c1.r2.cloudflarestorage.com/videos/cmmo310z9000drsl96wk8xl81/audio/voiceover.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=0a377e6625c054addc77e477b7e971a0%2F20260317%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260317T102133Z&X-Amz-Expires=3600&X-Amz-Signature=1f125a258b7c8edfac8afdc2b8358cba5f509d75de7421cc8c7e1bbb5370271b&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject",
            videoUrl: null,
            backgroundMusicUrl: null,
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

    // render video to cloudflare r2 using render video url
    const uploadVideo = await step.run("upload-video-to-r2", async () => {
      const videoId = "cmmo310z9000drsl96wk8xl81";
      if (!renderVideo) {
        throw new Error("Render video failed");
      }
      const response = await fetch(renderVideo);
      const videoBuffer = Buffer.from(await response.arrayBuffer());

      const r2Key = `videos/${videoId}/${videoId}.mp4`;

      await uploadVideoToR2({
        buffer: videoBuffer,
        key: r2Key,
        contentType: "video/mp4",
      });

      return r2Key;
    });

    // save video and thumbnail R2 keys to DB

    await step.run("save-video-to-db", async () => {
      const videoId = "cmmo310z9000drsl96wk8xl81";

      await prisma.video.update({
        where: { id: videoId },
        data: {
          r2ObjectKey: uploadVideo,
          // thumbnailR2ObjectKey: imageR2Keys[0],
          thumbnailR2ObjectKey:
            "videos/cmmo310z9000drsl96wk8xl81/images/scene_0.png",
          status: "SUCCESS",
        },
      });
    });

    return {
      success: true,
    };

    // return {
    //   videoId,
    //   imageCount: imageR2Keys.length,
    //   audioR2Key,
    //   caption: captionData,
    //   durationSeconds: captionData.duration,
    // };
  },
);
