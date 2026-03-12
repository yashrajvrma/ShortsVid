import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { voiceRouter } from "./voices";
import { stockRouter } from "./stocks";
import { videoRouter } from "./videos";

export const appRouter = createTRPCRouter({
  voices: voiceRouter,
  stocks: stockRouter,
  videos: videoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
