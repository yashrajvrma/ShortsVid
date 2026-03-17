import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";
import { inngest } from "@/inngest/client";
import {
  getSignedAudioUrl,
  getSignedObjectUrl,
  getSignedUrlInBulk,
} from "@/lib/r2-bucket";

export const videoRouter = createTRPCRouter({
  generateFacelessVideo: authProcedure
    .input(
      z.object({
        languageCode: z.string(),
        topic: z.enum([
          "MOTIVATIONAL",
          "HORROR_STORY",
          "HISTORY_FACTS",
          "PHILOSOPHY",
          "STORYTELLING",
          "MYSTERY_STORY",
          "LIFE_HACKS",
          "ANY_TOPIC",
        ]),
        prompt: z.string().optional(),
        duration: z.number(),
        script: z
          .string()
          .min(1, "Script cannot be empty")
          .max(1200, "Script must be under 1200 characters..."),
        voiceId: z.string(),
        musicId: z.string().nullable(),
        videoStyle: z.enum([
          "PHOTO_REALISTIC",
          "CARTOON",
          "ANIME",
          "CYBERPUNK",
          "CINEMATIC",
          "PIXEL_ART",
          "COLORFUL_COMICS",
        ]),

        // ── Caption ──────────────────────────────────────────────────────────
        captionsEnabled: z.boolean().default(true),
        captionConfig: z.object({
          // Colors
          textColor: z.string(),
          strokeColor: z.string(),
          highlightColor: z.string(),
          highlightStrokeColor: z.string(),
          popBackgroundColor: z.string(),

          // Effects — strokeWidth/shadow/fontSize/letterSpacing can be decimals
          strokeWidth: z.number(),
          fontSize: z.number(),
          verticalPosition: z.number().int(),
          horizontalPosition: z.number().int(),
          maxLines: z.number().int(),
          maxWordsPerLine: z.number().int(),
          shadowOffsetY: z.number(),
          shadowBlur: z.number(),

          // Typography
          fontFamily: z.string(),
          fontWeight: z.string(),
          textTransform: z.enum([
            "uppercase",
            "lowercase",
            "capitalize",
            "none",
          ]),
          letterSpacing: z.number(),

          animationPreset: z.enum(["pop", "fade", "slide", "none"]),

          // Light leak
          lightLeakHue: z.number().int(),
          lightLeakSeed: z.number().int(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      // 1. Validate voice exists
      const voice = await prisma.voice.findUnique({
        where: { id: input.voiceId },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Selected voice not found",
        });
      }

      // 2. Validate music exists (if provided)
      if (input.musicId) {
        const music = await prisma.stock.findUnique({
          where: { id: input.musicId, stockType: "MUSIC" },
        });

        if (!music) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Selected background music not found",
          });
        }
      }

      // 3. Extra server-side script length guard
      if (input.script.length > 1200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Script exceeds the maximum allowed length of 1200 characters",
        });
      }

      // 4. Split script into paragraphs
      const paragraphs = input.script
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // 5. Transaction — create script, optionally caption config, then video
      const video = await prisma.$transaction(async (tx) => {
        // Create script
        const script = await tx.script.create({
          data: {
            userId,
            prompt: input.prompt ?? null,
            languageCode: input.languageCode,
            topic: input.topic,
            duration: input.duration,
            content: paragraphs,
          },
        });

        // Only create a CaptionConfig row when captions are enabled
        let captionConfigId: string | null = null;

        if (input.captionsEnabled) {
          const captionConfig = await tx.captionConfig.create({
            data: {
              // Colors
              textColor: input.captionConfig.textColor,
              strokeColor: input.captionConfig.strokeColor,
              highlightColor: input.captionConfig.highlightColor,
              highlightStrokeColor: input.captionConfig.highlightStrokeColor,
              popBackgroundColor: input.captionConfig.popBackgroundColor,

              // Effects
              strokeWidth: input.captionConfig.strokeWidth,
              fontSize: input.captionConfig.fontSize,
              verticalPosition: input.captionConfig.verticalPosition,
              horizontalPosition: input.captionConfig.horizontalPosition,
              maxLines: input.captionConfig.maxLines,
              maxWordsPerLine: input.captionConfig.maxWordsPerLine,
              shadowOffsetY: input.captionConfig.shadowOffsetY,
              shadowBlur: input.captionConfig.shadowBlur,

              // Typography
              fontFamily: input.captionConfig.fontFamily,
              fontWeight: input.captionConfig.fontWeight,
              textTransform: input.captionConfig.textTransform,
              letterSpacing: input.captionConfig.letterSpacing,

              // Animation
              animationPreset: input.captionConfig.animationPreset,

              // Light leak
              lightLeakHue: input.captionConfig.lightLeakHue,
              lightLeakSeed: input.captionConfig.lightLeakSeed,
            },
          });

          captionConfigId = captionConfig.id;
        }

        // Create video — captionConfigId is null when captions are disabled
        return tx.video.create({
          data: {
            userId,
            videoStyle: input.videoStyle,
            status: "GENERATING",
            scriptId: script.id,
            voiceId: input.voiceId,
            captionConfigId: captionConfigId,
            backgroundMusicId: input.musicId ?? null,
          },
        });
      });

      // 6. Trigger Inngest workflow
      await inngest.send({
        name: "shorts/generate",
        data: {
          userId,
          videoId: video.id,
        },
      });

      return {
        success: true,
        videoId: video.id,
        status: video.status,
      };
    }),
  getAllShorts: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        duration: true,
        thumbnailR2ObjectKey: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const videosWithSignedUrls = await Promise.all(
      videos.map(async (video) => {
        const signedThumbnailUrl = video.thumbnailR2ObjectKey
          ? await getSignedObjectUrl(video.thumbnailR2ObjectKey)
          : null;

        return {
          ...video,
          signedThumbnailUrl,
        };
      }),
    );

    return videosWithSignedUrls;
  }),
  // getShortsById: authProcedure
  //   .input(z.object({ videoId: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const { userId } = ctx;

  //     // check if videoId exist
  //     const video = await prisma.video.findUnique({
  //       where: { id: input.videoId, userId },
  //       include: {
  //         script: true,
  //         captionConfig: true,
  //         stock: true,
  //         voice: true,
  //       },
  //     });

  //     if (!video) {
  //       throw new TRPCError({
  //         code: "NOT_FOUND",
  //         message: "Video not found",
  //       });
  //     }

  //     // if (video.status === "GENERATING") {
  //     //   return {
  //     //     id: video.id,
  //     //     status: video.status,
  //     //     videoStyle: video.videoStyle,
  //     //     script: {
  //     //       languageCode: video.script?.languageCode,
  //     //       topic: video.script?.topic,
  //     //       content: video.script?.content,
  //     //     },
  //     //     voice: video.voiceId
  //     //       ? {
  //     //           name: video?.voice?.name,
  //     //           languageCode: video?.voice?.languageCode,
  //     //           gender: video?.voice?.gender,
  //     //         }
  //     //       : null,
  //     //     stock: video.backgroundMusicId
  //     //       ? {
  //     //           name: video.stock?.name,
  //     //           stockType: video.stock?.stockType,
  //     //         }
  //     //       : null,
  //     //     videoUrl: null,
  //     //   };
  //     // }

  //     return;
  //   }),
  exportVideo: authProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      // get the video details
      const video = await prisma.video.findUnique({
        where: { id: input.videoId, userId },
      });

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid video Id",
        });
      }

      if (video.status === "GENERATING") {
        throw new TRPCError({
          code: "UNPROCESSABLE_CONTENT",
          message: "Video is being generated, Pls try after some time",
        });
      }

      if (video.status === "FAILED") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Video generation failed, Please try again",
        });
      }

      if (video.status === "SUCCESS") {
        // generate signed url of the video and return it to the client
        const r2Key = video.r2ObjectKey;
        if (!r2Key) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong, Please try again",
          });
        }

        const signedVideoUrl = await getSignedObjectUrl(r2Key);

        return {
          id: video.id,
          status: video.status,
          downloadUrl: signedVideoUrl,
        };
      }

      if (video.status === "RENDERING") {
        return {
          id: video.id,
          status: video.status,
          message: "Video is being exported, Please wait for some time",
        };
      }

      if (video.status === "READY") {
        // Trigger Inngest workflow
        await inngest.send({
          name: "shorts/render",
          data: {
            userId,
            videoId: video.id,
          },
        });

        return {
          success: true,
          status: video.status,
          message:
            "Video export started, We will notify you once it's ready for download",
        };
      }
    }),
});
