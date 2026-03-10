import { prisma } from "@/db";
import { authProcedure, createTRPCRouter } from "../init";
import { getSignedAudioUrl } from "@/lib/r2-bucket";

export const stockRouter = createTRPCRouter({
  getAllBackgroundMusic: authProcedure.query(async ({ ctx }) => {
    const [systemUploadedMusic, userUploadedMusic] = await Promise.all([
      prisma.stock.findMany({
        where: {
          stockVariant: "SYSTEM",
          stockType: "MUSIC",
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.stock.findMany({
        where: {
          stockVariant: "USER",
          stockType: "MUSIC",
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
            const musicUrl = await getSignedAudioUrl(music.r2ObjectKey!);

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
});
