import { createTRPCRouter } from "../init";
import { voiceRouter } from "./voices";
import { stockRouter } from "./stocks";
import { videoRouter } from "./videos";
import { billingRouter } from "./billing";
import { toolRouter } from "./tools";

export const appRouter = createTRPCRouter({
  voices: voiceRouter,
  stocks: stockRouter,
  videos: videoRouter,
  billing: billingRouter,
  tools: toolRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
