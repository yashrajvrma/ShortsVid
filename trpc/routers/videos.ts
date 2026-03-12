import { z } from "zod";
import { authProcedure, createTRPCRouter } from "../init";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";
import { inngest } from "@/inngest/client";

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
        captionConfig: z.object({
          fontType: z.string(),
          fontSize: z.number(),
          textColor: z.string(),
          backgroundColor: z.string(),
          strokeColor: z.string(),
          strokeWidth: z.number(),
          highlightColor: z.string(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      // 1. Validate if voice exists
      const voice = await prisma.voice.findUnique({
        where: { id: input.voiceId },
      });

      if (!voice) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Selected voice not found",
        });
      }

      // 2. Validate if music exists (if provided)
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

      if (input.script.length > 1200) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Script exceeds the maximum allowed length of 1200 characters",
        });
      }

      // 3. Create the script, caption config, and video in a transaction
      // Split the script by double newline for paragraphs
      const paragraphs = input.script
        .split("\n\n")
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

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

        // Create caption config
        const captionConfig = await tx.captionConfig.create({
          data: {
            ...input.captionConfig,
          },
        });

        // Create video
        return tx.video.create({
          data: {
            userId,
            videoStyle: input.videoStyle,
            status: "PROCESSING",
            scriptId: script.id,
            voiceId: input.voiceId,
            captionConfigId: captionConfig.id,
            backgroundMusicId: input.musicId ?? null,
          },
        });
      });

      // 4. Trigger Inngest workflow
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
});
