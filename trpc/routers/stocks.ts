import { prisma } from "@/db";
import { authProcedure, createTRPCRouter } from "../init";
import { getSignedObjectUrl } from "@/lib/r2-bucket";

export const stockRouter = createTRPCRouter({
  getAllBackgroundMusic: authProcedure.query(async ({ ctx }) => {
    const [systemUploadedMusic, userUploadedMusic] = await Promise.all([
      prisma.stock.findMany({
        where: {
          stockVariant: "SYSTEM",
          stockType: "BG_MUSIC",
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stock.findMany({
        where: {
          stockVariant: "USER",
          stockType: "BG_MUSIC",
          userId: ctx.userId,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

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

    const [systemBackgroundMusic, userbackgroundMusic] = await Promise.all([
      convertR2ObjectKeyToSignedUrl(systemUploadedMusic),
      convertR2ObjectKeyToSignedUrl(userUploadedMusic),
    ]);

    return {
      systemMusic: systemBackgroundMusic,
      userMusic: userbackgroundMusic,
    };
  }),

  getSystemBgVideos: authProcedure.query(async () => {
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

  getSystemAiAvatars: authProcedure.query(async () => {
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
      return (
        await Promise.all(avatarList.filter((avatar) => avatar.r2ObjectKey))
      ).map(async (avatar) => {
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
      });
    };

    const systemAiAvatar = await convertR2ObjectKeyToSignedUrl(avatar);

    return { avatars: systemAiAvatar };
  }),
});
