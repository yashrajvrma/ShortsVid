import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import {
  generateConversationVideo,
  generateShort,
  renderShorts,
  renderConversationVideo,
} from "@/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateShort,
    renderShorts,
    generateConversationVideo,
    renderConversationVideo,
    /* your functions will be passed here later! */
  ],
});
