import { prisma } from "@/db";
import { authProcedure, baseProcedure, createTRPCRouter } from "../init";
import { getSignedObjectUrl } from "@/lib/r2-bucket";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const stockRouter = createTRPCRouter({
  getAllBackgroundMusic: baseProcedure.query(async () => {
    const systemUploadedMusic = await prisma.stock.findMany({
      where: {
        stockVariant: "SYSTEM",
        stockType: "BG_MUSIC",
      },
      orderBy: { createdAt: "desc" },
    });

    const convertR2ObjectKeyToSignedUrl = async (
      musicList: typeof systemUploadedMusic,
    ) => {
      return Promise.all(
        musicList
          .filter((music) => music.r2ObjectKey)
          .map(async (music) => {
            const musicUrl = await getSignedObjectUrl(music.r2ObjectKey!);

            return {
              id: music.id,
              name: music.name,
              description: music.description,
              stockVariant: music.stockVariant,
              stockType: music.stockType,
              mimetype: music.mimetype,
              musicUrl,
              createdAt: music.createdAt,
              updatedAt: music.updatedAt,
            };
          }),
      );
    };

    const systemBackgroundMusic =
      await convertR2ObjectKeyToSignedUrl(systemUploadedMusic);

    return systemBackgroundMusic;
  }),

  getSystemBackgroundVideos: baseProcedure.query(async () => {
    const videos = await prisma.stock.findMany({
      where: {
        stockVariant: "SYSTEM",
        stockType: "BG_VIDEO",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const convertR2ObjectKeyToSignedUrl = async (videoList: typeof videos) => {
      return Promise.all(
        videoList
          .filter((video) => video.thumbnailR2ObjectKey)
          .map(async (video) => {
            const thumbnailUrl = await getSignedObjectUrl(
              video.thumbnailR2ObjectKey!,
            );

            return {
              id: video.id,
              name: video.name,
              description: video.description,
              stockVariant: video.stockVariant,
              stockType: video.stockType,
              mimeType: video.mimetype,
              thumbnailUrl,
              createdAt: video.createdAt,
              updatedAt: video.updatedAt,
            };
          }),
      );
    };

    const systemBgVideos = await convertR2ObjectKeyToSignedUrl(videos);

    return { videos: systemBgVideos };
  }),

  getBackgroundVideoById: authProcedure
    .input(
      z.object({
        videoId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const video = await prisma.stock.findUnique({
        where: {
          id: input.videoId,
        },
      });

      if (!video) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video id not found",
        });
      }

      const [thumbnailUrl, videoUrl] = await Promise.all([
        video.thumbnailR2ObjectKey
          ? getSignedObjectUrl(video.thumbnailR2ObjectKey)
          : null,
        video.r2ObjectKey ? getSignedObjectUrl(video.r2ObjectKey) : null,
      ]);

      return {
        id: video.id,
        name: video.name,
        description: video.description,
        stockVariant: video.stockVariant,
        stockType: video.stockType,
        mimeType: video.mimetype,
        thumbnailUrl,
        videoUrl,
        createdAt: video.createdAt,
        updatedAt: video.updatedAt,
      };
    }),

  getSystemAiAvatars: baseProcedure.query(async () => {
    const avatar = await prisma.stock.findMany({
      where: {
        stockVariant: "SYSTEM",
        stockType: "AI_AVATAR",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const convertR2ObjectKeyToSignedUrl = async (avatarList: typeof avatar) => {
      return Promise.all(
        avatarList
          .filter((avatar) => avatar.r2ObjectKey)
          .map(async (avatar) => {
            const avatarUrl = await getSignedObjectUrl(avatar.r2ObjectKey!);

            return {
              id: avatar.id,
              name: avatar.name,
              description: avatar.description,
              stockVariant: avatar.stockVariant,
              stockType: avatar.stockType,
              mimeType: avatar.mimetype,
              avatarUrl,
              createdAt: avatar.createdAt,
              updatedAt: avatar.updatedAt,
            };
          }),
      );
    };

    const systemAiAvatar = await convertR2ObjectKeyToSignedUrl(avatar);

    return { avatars: systemAiAvatar };
  }),
});
