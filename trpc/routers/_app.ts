import { promise, z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { resolve } from "path";
export const appRouter = createTRPCRouter({
  hello: baseProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(async (opts) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return {
        greeting: `hello ${opts.input.text}`,
      };
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
