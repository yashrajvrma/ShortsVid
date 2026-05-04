import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShortsVid – AI Short Video Generator",
    short_name: "ShortsVid",
    description:
      "Create viral YouTube Shorts, Instagram Reels, and TikTok videos in minutes with AI. No editing skills required.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    categories: ["productivity", "entertainment", "utilities"],
    theme_color: "#8b5cf6",
    background_color: "#0a0a0a",
    icons: [
      {
        src: "/web-app-manifest-192x192.webp",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.webp",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Create Faceless Short",
        short_name: "Faceless Shorts",
        url: "/app/shorts/faceless-shorts",
        description: "Create a new AI-powered faceless short video",
      },
      {
        name: "Create Brainrot Videos",
        short_name: "Brainrot Videos",
        url: "/app/shorts/conversation-videos",
        description: "Create Brainrot Videos",
      },
      {
        name: "Library",
        short_name: "Library",
        url: "/app/library",
        description: "View all your generated videos",
      },
    ],
  };
}
