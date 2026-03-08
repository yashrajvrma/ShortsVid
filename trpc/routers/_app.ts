import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "../init";
import { videoRouter } from "./video";
export const appRouter = createTRPCRouter({
  voices: videoRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
