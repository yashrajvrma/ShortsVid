import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  generateConversationVideo,
  generateShort,
  helloWorld,
  renderShorts,
} from "@/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    helloWorld,
    generateShort,
    renderShorts,
    generateConversationVideo,
    /* your functions will be passed here later! */
  ],
});
