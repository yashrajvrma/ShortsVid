import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/db";
import { authProcedure, createTRPCRouter } from "../init";

export const videoRouter = createTRPCRouter({
  //   getAll : authProcedure.input(z.object({
  //   })).query(async ({ ctx }) => {
  //     // const videos = await prisma.video.findMany({
  //     //   where: {
  //     //     userId: ctx.userId,
  //     //   },
  //     // });
  //     return { videos: [] };
  //   }
});
