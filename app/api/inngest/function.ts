import { inngest } from "@/inngest/client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

export const GenerateShort = inngest.createFunction(
  { id: "generate-short" },
  { event: "shorts/generate" },
  async ({ event, step }) => {
    // generate image prompt using script

    // generate images

    // generate audio

    const generateAudioFile = await step.run("generate-audio", async () => {
      // call your audio generation API here, and return the file URL

      return "";
    });

    // generate captions
  },
);
