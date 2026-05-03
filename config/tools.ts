import {
  Video,
  Flame,
  Gamepad2,
  FileText,
  MessageSquare,
  Calculator,
  Globe,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Tool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  live: boolean;
  badge?: string;
  href: string;
  iconColor: string;
  iconBg: string;
};

export const TOOLS: Tool[] = [
  {
    slug: "faceless-shorts",
    title: "Faceless Shorts Generator",
    shortTitle: "Faceless Shorts",
    description:
      "Generate AI-powered faceless YouTube Shorts with custom voice, captions, and background music. No camera needed.",
    icon: Video,
    live: true,
    badge: "Popular",
    href: "/tools/faceless-shorts",
    iconColor: "text-orange-500",
    iconBg: "bg-orange-500/10",
  },
  {
    slug: "brainrot-video-generator",
    title: "Brainrot Video Generator",
    shortTitle: "Brainrot Generator",
    description:
      "Create viral brainrot content with AI-generated scripts, unhinged voiceovers, and chaotic captions.",
    icon: Flame,
    live: false,
    href: "/tools/brainrot-video-generator",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    slug: "minecraft-parkour-generator",
    title: "Minecraft Parkour Video Generator",
    shortTitle: "Minecraft Parkour",
    description:
      "Auto-generate satisfying Minecraft parkour background clips for your Shorts and TikToks.",
    icon: Gamepad2,
    live: false,
    href: "/tools/minecraft-parkour-generator",
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
  },
  {
    slug: "tiktok-transcript",
    title: "TikTok Transcript Generator",
    shortTitle: "TikTok Transcript",
    description:
      "Extract accurate transcripts from any TikTok video in seconds. Free, fast, no account required.",
    icon: FileText,
    live: false,
    href: "/tools/tiktok-transcript",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    slug: "fake-imessage-generator",
    title: "Fake iMessage Generator",
    shortTitle: "iMessage Generator",
    description:
      "Create realistic fake iPhone iMessage conversations for entertainment content and story videos.",
    icon: MessageSquare,
    live: false,
    href: "/tools/fake-imessage-generator",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },
  {
    slug: "tiktok-money-calculator",
    title: "TikTok Money Calculator",
    shortTitle: "TikTok Calculator",
    description:
      "Calculate your estimated TikTok earnings based on followers, views, and engagement rate.",
    icon: Calculator,
    live: false,
    href: "/tools/tiktok-money-calculator",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    slug: "italian-brainrot-generator",
    title: "Italian Brainrot Generator",
    shortTitle: "Italian Brainrot",
    description:
      "Generate Italian brainrot videos with authentic Italian AI voices, chaotic energy, and meme-worthy scripts.",
    icon: Globe,
    live: false,
    href: "/tools/italian-brainrot-generator",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
  },
];
