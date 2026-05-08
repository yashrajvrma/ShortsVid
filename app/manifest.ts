import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShortsVid – Automate viral Faceless shorts and earn passive income.",
    short_name: "ShortsVid",
    description:
      "Create viral Faceless Shorts, Brainrot explainer videos and TikToks in minutes with AI. No editing skills required.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "en",
    categories: ["productivity", "entertainment", "utilities"],
    theme_color: "#8b5cf6",
    background_color: "#0a0a0a",
    icons: [
      {
        src: "/images/web-app-manifest-192x192.webp",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/web-app-manifest-512x512.webp",
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
        name: "Create Brainrot Explainer",
        short_name: "Brainrot Explainer",
        url: "/app/shorts/conversation-videos",
        description: "Create a new AI-powered brainrot explainer video",
      },
      {
        name: "Explore AI Tools",
        short_name: "AI Tools",
        url: "/tools",
        description: "Discover all our free AI video creation tools",
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
