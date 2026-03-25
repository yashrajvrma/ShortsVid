import { z } from "zod";
import { authProcedure, baseProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";
import { inngest } from "@/inngest/client";
import {
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
});
