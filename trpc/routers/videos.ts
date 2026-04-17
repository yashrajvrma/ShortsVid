import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { authProcedure, baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";
import { inngest } from "@/inngest/client";
import {
  deleteFromR2,
  getSignedAudioUrl,
  getSignedObjectUrl,
  getSignedUrlInBulk,
} from "@/lib/r2-bucket";
import { deductVideoCredits } from "@/lib/credit";
import { CREDITS_PER_VIDEO } from "@/lib/polar";

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
      // return if user dont have sufficent credits
      if (ctx.credit < CREDITS_PER_VIDEO) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: "Insufficient credits, Please upgrade your plan",
        });
      }

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
          where: { id: input.musicId, stockType: "BG_MUSIC" },
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
            userId: ctx.userId,
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
            userId: ctx.userId,
            videoStyle: input.videoStyle,
            status: "GENERATING",
            scriptId: script.id,
            voiceId: input.voiceId,
            captionConfigId: captionConfigId,
            backgroundMusicId: input.musicId ?? null,
          },
        });
      });

      try {
        Sentry.logger.info("Pushing video in queue", {
          userId: ctx.userId,
          videoId: video.id,
        });

        // 6. Trigger Inngest workflow
        await inngest.send({
          name: "shorts/generate",
          data: {
            userId: ctx.userId,
            videoId: video.id,
          },
        });

        // deduct five credits and check if there are active credits
        await deductVideoCredits(ctx.userId, video.id);
      } catch (error) {
        Sentry.logger.error("Failed to enqueue video generation in inngest", {
          userId: ctx.userId,
          videoId: video.id,
          error: (error as Error).message,
        });
      }

      return {
        success: true,
        videoId: video.id,
        status: video.status,
      };
    }),

  generateConversationVideo: authProcedure
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
        script: z.array(z.string()),
        speaker1AvatarId: z.string(),
        speaker2AvatarId: z.string(),
        voice1Id: z.string(),
        voice2Id: z.string(),
        backgroundVideoId: z.string(),
        backgroundMusicId: z.string().nullable(),

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
      // return if user dont have sufficent credits
      if (ctx.credit < CREDITS_PER_VIDEO) {
        throw new TRPCError({
          code: "PAYMENT_REQUIRED",
          message: "Insufficient credits, Please upgrade your plan",
        });
      }

      // validate background video exist
      const backgroundVideo = await prisma.stock.findUnique({
        where: {
          id: input.backgroundVideoId,
          stockType: "BG_VIDEO",
        },
      });

      if (!backgroundVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Background video not found",
        });
      }

      // validate speaker avatar exist
      const speaker1Avatar = await prisma.stock.findUnique({
        where: {
          id: input.speaker1AvatarId,
        },
      });

      if (!speaker1Avatar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Speaker 1 avatar not found",
        });
      }

      const speaker2Avatar = await prisma.stock.findUnique({
        where: {
          id: input.speaker2AvatarId,
        },
      });

      if (!speaker2Avatar) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Speaker 2 avatar not found",
        });
      }

      // validate voice exist
      const voice1 = await prisma.voice.findUnique({
        where: { id: input.voice1Id },
      });

      if (!voice1) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice 1 not found",
        });
      }

      const voice2 = await prisma.voice.findUnique({
        where: { id: input.voice2Id },
      });

      if (!voice2) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Voice 2 not found",
        });
      }

      // 2. Validate music exists (if provided)
      if (input.backgroundMusicId) {
        const backgroundMusic = await prisma.stock.findUnique({
          where: { id: input.backgroundMusicId, stockType: "BG_MUSIC" },
        });

        if (!backgroundMusic) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Background music not found",
          });
        }
      }

      // transaction to create script, caption config and video

      const conversationVideo = await prisma.$transaction(async (tx) => {
        // create script

        const script = await tx.script.create({
          data: {
            userId: ctx.userId,
            prompt: input.prompt ?? null,
            languageCode: input.languageCode,
            topic: input.topic,
            duration: input.duration,
            content: input.script,
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
        return tx.conversationVideo.create({
          data: {
            userId: ctx.userId,
            status: "GENERATING",
            scriptId: script.id,
            speaker1AvatarId: input.speaker1AvatarId,
            speaker2AvatarId: input.speaker2AvatarId,
            voice1Id: input.voice1Id,
            voice2Id: input.voice2Id,
            backgroundVideoId: input.backgroundVideoId,
            backgroundMusicId: input.backgroundMusicId ?? null,
            captionConfigId: captionConfigId,
          },
        });
      });

      try {
        Sentry.logger.info("Pushing video in queue", {
          userId: ctx.userId,
          videoId: conversationVideo.id,
        });

        // 6. Trigger Inngest workflow
        await inngest.send({
          name: "conversationVideo/generate",
          data: {
            userId: ctx.userId,
            videoId: conversationVideo.id,
          },
        });

        // deduct five credits and check if there are active credits
        await deductVideoCredits(ctx.userId, conversationVideo.id);
      } catch (error) {
        Sentry.logger.error("Failed to enqueue video generation in inngest", {
          userId: ctx.userId,
          videoId: conversationVideo.id,
          error: (error as Error).message,
        });
      }

      return {
        success: true,
        videoId: conversationVideo.id,
        status: conversationVideo.status,
      };
    }),

  getAllShorts: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      // select: {
      //   id: true,
      //   status: true,
      //   duration: true,
      //   thumbnailR2ObjectKey: true,
      //   createdAt: true,
      //   updatedAt: true,
      // },
      include: {
        script: {
          select: {
            prompt: true,
          },
        },
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

  getShortsById: baseProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      // const { userId } = ctx;

      const video = await prisma.video.findUnique({
        where: { id: input.videoId },
        include: {
          script: true,
          captionConfig: true,
          stock: true,
          voice: true,
        },
      });

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      // ── While still generating, return lightweight metadata only ──────────
      // No assets exist yet, so no signed URLs needed
      if (video.status === "GENERATING") {
        return {
          id: video.id,
          status: video.status,
          videoStyle: video.videoStyle,
          duration: video.duration,
          script: {
            id: video.script.id,
            languageCode: video.script.languageCode,
            topic: video.script.topic,
            prompt: video.script.prompt,
            content: video.script.content,
          },
          voice: video.voice
            ? {
                id: video.voice.id,
                name: video.voice.name,
                gender: video.voice.gender,
                languageCode: video.voice.languageCode,
              }
            : null,
          // No asset URLs yet
          imagesUrl: [] as string[],
          audioUrl: null,
          videoUrl: null,
          caption: video.caption,
          captionConfig: video.captionConfig,
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
        };
      }

      // ── Generate signed URLs for all R2 assets ────────────────────────────

      // Images — array of r2 object keys
      const imagesUrl = video.images.length
        ? await Promise.all(video.images.map((key) => getSignedObjectUrl(key)))
        : [];

      // Audio
      const audioUrl = video.audio
        ? await getSignedObjectUrl(video.audio)
        : null;

      // Thumbnail
      const thumbnailUrl = video.thumbnailR2ObjectKey
        ? await getSignedObjectUrl(video.thumbnailR2ObjectKey)
        : null;

      // Final rendered video (only exists on SUCCESS)
      const videoUrl =
        video.status === "SUCCESS" && video.r2ObjectKey
          ? await getSignedObjectUrl(video.r2ObjectKey)
          : null;

      // Background music
      const backgroundMusicUrl = video.stock?.r2ObjectKey
        ? await getSignedObjectUrl(video.stock.r2ObjectKey)
        : null;

      return {
        id: video.id,
        status: video.status,
        videoStyle: video.videoStyle,
        duration: video.duration,
        script: {
          id: video.script.id,
          languageCode: video.script.languageCode,
          topic: video.script.topic,
          prompt: video.script.prompt,
          content: video.script.content,
        },
        voice: video.voice
          ? {
              id: video.voice.id,
              name: video.voice.name,
              gender: video.voice.gender,
              languageCode: video.voice.languageCode,
            }
          : null,
        // Signed asset URLs — ready for Remotion
        captionConfig: video.captionConfig,
        caption: video.caption,
        imagesUrl,
        audioUrl,
        videoUrl,
        backgroundMusicUrl,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      };
    }),

  getAllConversationVideos: authProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    const coversationVideos = await prisma.conversationVideo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        script: {
          select: {
            prompt: true,
          },
        },
      },
    });

    const conversationVideosWithSignedUrls = await Promise.all(
      coversationVideos.map(async (video) => {
        const signedThumbnailUrl = video.thumbnailR2ObjectKey
          ? await getSignedObjectUrl(video.thumbnailR2ObjectKey)
          : null;

        return {
          ...video,
          signedThumbnailUrl,
        };
      }),
    );

    return conversationVideosWithSignedUrls;
  }),

  // TODO: make only one procedure for both faceless and conversation videos
  getConversationVideosById: baseProcedure
    .input(z.object({ videoId: z.string() }))
    .query(async ({ ctx, input }) => {
      // const { userId } = ctx;

      const conversationVideo = await prisma.conversationVideo.findUnique({
        where: { id: input.videoId },
        include: {
          script: true,
          voice1: true,
          voice2: true,
          captionConfig: true,
          backgroundMusic: true,
          backgroundVideo: true,
          speaker1Avatar: true,
          speaker2Avatar: true,
        },
      });

      if (!conversationVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation Video not found",
        });
      }

      // ── While still generating, return lightweight metadata only ──────────
      // No assets exist yet, so no signed URLs needed
      if (conversationVideo.status === "GENERATING") {
        return {
          id: conversationVideo.id,
          status: conversationVideo.status,
          duration: conversationVideo.duration,
          script: {
            id: conversationVideo.script.id,
            languageCode: conversationVideo.script.languageCode,
            topic: conversationVideo.script.topic,
            prompt: conversationVideo.script.prompt,
            content: conversationVideo.script.content,
          },
          // No asset URLs yet
          audioUrl: conversationVideo.audio,
          backgroundVideo: conversationVideo.backgroundVideo,
          caption: conversationVideo.caption,
          captionConfig: conversationVideo.captionConfig,
          createdAt: conversationVideo.createdAt,
          updatedAt: conversationVideo.updatedAt,
        };
      }

      // ── Generate signed URLs for all R2 assets
      // speaker avatar
      const [speaker1AvatarUrl, speaker2AvatarUrl] = await Promise.all([
        getSignedObjectUrl(conversationVideo.speaker1Avatar.r2ObjectKey!),
        getSignedObjectUrl(conversationVideo.speaker2Avatar.r2ObjectKey!),
      ]);

      // Audio
      const audioUrl = conversationVideo.audio
        ? await getSignedObjectUrl(conversationVideo.audio)
        : null;

      // Thumbnail
      const thumbnailUrl = conversationVideo.thumbnailR2ObjectKey
        ? await getSignedObjectUrl(conversationVideo.thumbnailR2ObjectKey)
        : null;

      // Final rendered video (only exists on SUCCESS)
      const videoUrl =
        conversationVideo.status === "SUCCESS" && conversationVideo.r2ObjectKey
          ? await getSignedObjectUrl(conversationVideo.r2ObjectKey)
          : null;

      // Background music
      const backgroundMusicUrl = conversationVideo.backgroundMusic?.r2ObjectKey
        ? await getSignedObjectUrl(
            conversationVideo.backgroundMusic.r2ObjectKey,
          )
        : null;

      // Background video
      const backgroundVideoUrl =
        conversationVideo.backgroundVideo.r2ObjectKey
          ? await getSignedObjectUrl(
              conversationVideo.backgroundVideo.r2ObjectKey,
            )
          : null;

      return {
        id: conversationVideo.id,
        status: conversationVideo.status,
        duration: conversationVideo.duration,
        script: {
          id: conversationVideo.script.id,
          languageCode: conversationVideo.script.languageCode,
          topic: conversationVideo.script.topic,
          prompt: conversationVideo.script.prompt,
          content: conversationVideo.script.content,
        },
        // Signed asset URLs — ready for Remotion
        captionConfig: conversationVideo.captionConfig,
        caption: conversationVideo.caption,
        speaker1AvatarUrl,
        speaker2AvatarUrl,
        audioUrl,
        videoUrl,
        backgroundVideoUrl,
        backgroundMusicUrl,
        createdAt: conversationVideo.createdAt,
        updatedAt: conversationVideo.updatedAt,
      };
    }),

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
          message: "Video has been exported successfully",
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

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const videoStatus = await prisma.video.findUnique({
          where: { id: input.videoId, userId },
        });

        return {
          id: video.id,
          status: videoStatus?.status,
          message:
            "Video export started, We will notify you once it's ready for download",
        };
      }
    }),

  getVideoStatus: authProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      // get the status
      const video = await prisma.video.findUnique({
        where: { id: input.videoId, userId },
      });

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid video Id",
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
          message: "Video has been exported successfully",
          createdAt: video.createdAt,
          updatedAt: video.updatedAt,
        };
      }

      return {
        id: video.id,
        status: video.status,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      };
    }),

  deleteVideo: authProcedure
    .input(z.object({ videoId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      const video = await prisma.video.findUnique({
        where: { id: input.videoId, userId },
      });

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invalid video Id",
        });
      }

      const r2KeysToDelete = [
        video.r2ObjectKey,
        video.audio,
        video.thumbnailR2ObjectKey,
        ...video.images,
      ].filter(Boolean) as string[];

      // Delete the video first (sets captionConfigId to null via SetNull)
      await prisma.video.delete({
        where: { id: input.videoId, userId },
      });

      // Now safe to delete the orphaned CaptionConfig
      if (video.captionConfigId) {
        await prisma.captionConfig
          .delete({
            where: { id: video.captionConfigId },
          })
          .catch((error) => {
            Sentry.logger.error(
              "Failed to delete CaptionConfig during video deletion",
              {
                userId,
                videoId: input.videoId,
                captionConfigId: video.captionConfigId,
                error: (error as Error).message,
              },
            );
          });
      }

      // Delete R2 assets (best-effort, non-blocking)
      await Promise.allSettled(
        r2KeysToDelete.map((key) =>
          deleteFromR2(key).catch((error) => {
            Sentry.logger.error(
              "Failed to delete R2 asset during video deletion",
              {
                userId,
                videoId: input.videoId,
                key,
                error: (error as Error).message,
              },
            );
          }),
        ),
      );

      return { message: "Video deleted successfully" };
    }),
});
