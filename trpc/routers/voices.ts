import { z } from "zod";
import { prisma } from "@/db";
import { baseProcedure, createTRPCRouter } from "../init";
import { Prisma } from "@prisma/client";
import { getSignedAudioUrl } from "@/lib/r2-bucket";

export const voiceRouter = createTRPCRouter({
  getSystemVoice: baseProcedure
    .input(
      z.object({
        languageCode: z.string().min(1),
        query: z.string().trim().optional(),
      }),
    )
    .query(async ({ input }) => {
      // create the search filter for prisma with typesafety
      const searchFilter: Prisma.VoiceWhereInput = input?.query
        ? {
            OR: [
              {
                name: {
                  contains: input.query,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  has: input.query,
                },
              },
            ],
          }
        : {};

      const voices = await prisma.voice.findMany({
        where: {
          voiceVariant: "SYSTEM",
          languageCode: {
            has: input.languageCode,
          },
          ...searchFilter,
        },
        select: {
          id: true,
          name: true,
          description: true,
          tags: true,
          gender: true,
          r2ObjectKey: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      const voicesWithSignedUrl = await Promise.all(
        voices
          .filter((voice) => voice.r2ObjectKey !== null)
          .map(async (voice) => {
            const audioUrl = await getSignedAudioUrl(voice.r2ObjectKey!);

            return {
              id: voice.id,
              name: voice.name,
              description: voice.description,
              tags: voice.tags,
              gender: voice.gender,
              audioUrl,
              createdAt: voice.createdAt,
              updatedAt: voice.updatedAt,
            };
          }),
      );

      return { voicesWithSignedUrl };
    }),
});
