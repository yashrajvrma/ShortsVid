import { prisma } from "@/db";
import { authProcedure, createTRPCRouter } from "../init";
import { getSignedAudioUrl } from "@/lib/r2-bucket";
import { SYSTEM_AI_AVATAR, SYSTEM_BG_VIDEO } from "@/lib/constants";

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

  // ── Background Videos (dummy data — replace with DB/R2 later) ────────────
  getBackgroundVideos: authProcedure.query(async () => {
    const videos = SYSTEM_BG_VIDEO.map((name, i) => ({
      id: String(i + 1),
      name: name
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      slug: name,
      thumbnail: null as string | null,
      category: name.startsWith("minecraft") ? "Minecraft" : "Subway Surfer",
    }));
    return { videos };
  }),

  // ── AI Avatars (dummy data — replace with DB/R2 later) ───────────────────
  getAiAvatars: authProcedure.query(async () => {
    const avatars = SYSTEM_AI_AVATAR.map((slug, i) => {
      // e.g. "andrewtate_1" → "Andrew Tate"
      const label = slug
        .replace(/_\d+$/, "")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        id: String(i + 1),
        slug,
        label,
        thumbnail: null as string | null,
      };
    });
    return { avatars };
  }),
});
