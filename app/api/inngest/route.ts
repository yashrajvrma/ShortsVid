import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateShort, helloWorld } from "./function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateShort,
    /* your functions will be passed here later! */
  ],
});
