import type {
  CaptionPreset,
  CaptionStyle,
  Duration,
  Language,
  Tool,
  Topic,
} from "@/types";
import {
  Video,
  Flame,
  Gamepad2,
  FileText,
  MessageSquare,
  Calculator,
  Globe,
  TrendingUp,
} from "lucide-react";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

export const LANGUAGE_MAP: Record<string, string> = {
  en: "English",
  de: "German",
  fr: "French",
  ru: "Russian",
  ja: "Japanese",
  zh: "Chinese",
};

export const VIDEO_STYLE_VALUES = [
  "PHOTO_REALISTIC",
  "CARTOON",
  "PIXEL_ART",
  "COLORFUL_COMICS",
  // TODO: remove this
  "COMIC",
  "PIXAR",
  "ANIME",
  "CYBERPUNK",
  "CINEMATIC",
  "MANGA",
  "ILLUSTRATION",
  "CARTOON_3D",
] as const;

export const VIDEO_STYLES: {
  id: number | string;
  name?: string;
  label: string;
  thumbnail: string;
}[] = [
  {
    id: "ANIME",
    label: "Anime",
    thumbnail: "/images/stocks/anime.webp",
  },
  {
    id: "CARTOON",
    label: "Cartoon",
    thumbnail: "/images/stocks/cartoon.webp",
  },
  {
    id: "CINEMATIC",
    label: "Cinematic",
    thumbnail: "/images/stocks/cinematic.jpeg",
  },
  {
    id: "COLORFUL_COMICS",
    label: "Colorful Comics",
    thumbnail: "/images/stocks/colorful_comics.webp",
  },
  {
    id: "CARTOON_3D",
    label: "3D Cartoon",
    thumbnail: "/images/stocks/cartoon_3d.avif",
  },
  {
    id: "CYBERPUNK",
    label: "Cyberpunk",
    thumbnail: "/images/stocks/cyberpunk.webp",
  },
  {
    id: "ILLUSTRATION",
    label: "Illustration",
    thumbnail: "/images/stocks/illustration.png",
  },
  {
    id: "COMIC",
    label: "Comic",
    thumbnail: "/images/stocks/comic.jpg",
  },
  {
    id: "PIXAR",
    label: "Pixar",
    thumbnail: "/images/stocks/pixar.webp",
  },
  {
    id: "MANGA",
    label: "Manga Comic",
    thumbnail: "/images/stocks/manga.jpeg",
  },
  {
    id: "PIXEL_ART",
    label: "Pixel Art",
    thumbnail: "/images/stocks/pixel_art.webp",
  },
  {
    id: "PHOTO_REALISTIC",
    label: "Photo Realistic",
    thumbnail: "/images/stocks/realistic.webp",
  },
];

export const DURATIONS: Duration[] = [
  { id: 1, value: 15, label: "10-15sec" },
  { id: 2, value: 30, label: "15-30sec" },
  { id: 3, value: 60, label: "30-60sec" },
];

// fonts
export const FONT_FAMILIES = {
  bangers: "Bangers",
  montserrat: "Montserrat",
  oswald: "Oswald",
  permanentMarker: "Permanent Marker",
  inter: "Inter",
  bebasNeue: "Bebas Neue",
  rubikDirt: "Rubik Dirt",
  komikaAxis: "komikaAxis",
} as const;

export type FontKey = keyof typeof FONT_FAMILIES;
export type FontFamily = (typeof FONT_FAMILIES)[FontKey];

// captions
export const CAPTION_PRESETS: CaptionPreset[] = [
  {
    id: "hormozi-style",
    name: "Alex Hormozi",
    description:
      "Heavy white text with thick black stroke and neon green highlight — punchy creator-style lower thirds",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#00FF41",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 1,
      fontSize: 104,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 4,
      shadowBlur: 6,

      fontFamily: FONT_FAMILIES.montserrat,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: -2,

      animationPreset: "fade",
      lightLeakHue: 0,
      lightLeakSeed: 0,
    },
  },

  // ── 2. "A lot of my clients" style ────────────────────────────────────────
  // Black text on white, purple pill behind active word, rounded font
  {
    id: "purple-pill",
    name: "Purple Pill",
    description: "Dark text, purple highlight pill — clean & modern",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#FFFFFF",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "#6C3CF7",

      strokeWidth: 0.5,
      fontSize: 85,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 0,
      shadowBlur: 0,

      fontFamily: FONT_FAMILIES.montserrat,
      fontWeight: "800",
      textTransform: "none",
      letterSpacing: 0,

      animationPreset: "pop",
      lightLeakHue: 240,
      lightLeakSeed: 3,
    },
  },

  // ── 3. "With Short Hair" style ─────────────────────────────────────────────
  // White chunky text, bold red highlight, heavy black stroke — comic style
  {
    id: "comic-bold",
    name: "Comic Bold",
    description: "White + red, thick stroke — bold comic-book energy",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#fc2b2b",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 90,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 4,
      shadowBlur: 30,

      fontFamily: FONT_FAMILIES.komikaAxis,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 2,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 1,
    },
  },

  // ── 4. "captions" style — minimal lowercase ────────────────────────────────
  // Off-white, thin font, no stroke, no highlight color change, subtle shadow
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    description: "Soft white, thin font — elegant and distraction-free",
    style: {
      textColor: "#000000",
      strokeColor: "transparent",
      highlightColor: "#000000",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "transparent",

      strokeWidth: 0,
      fontSize: 90,
      verticalPosition: 85,
      horizontalPosition: 50,
      maxLines: 1,
      maxWordsPerLine: 2,
      shadowOffsetY: 2,
      shadowBlur: 12,

      fontFamily: FONT_FAMILIES.inter,
      fontWeight: "600",
      textTransform: "lowercase",
      letterSpacing: -5,

      animationPreset: "none",
      lightLeakHue: 0,
      lightLeakSeed: 2,
    },
  },
  {
    id: "viral-green",
    name: "Viral Green",
    description: "White words, green highlight — classic talking-head style",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#00FF85",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 96,
      verticalPosition: 75,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 3,
      shadowBlur: 8,

      fontFamily: FONT_FAMILIES.oswald,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: -4,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 0,
    },
  },

  // ── 5. Yellow highlight — TikTok classic ──────────────────────────────────
  {
    id: "tiktok-yellow",
    name: "TikTok Yellow",
    description: "Yellow active word, white resting — the OG TikTok look",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#FFD600",
      highlightStrokeColor: "#000000",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 100,
      verticalPosition: 80,
      horizontalPosition: 50,
      maxLines: 1,
      maxWordsPerLine: 2,
      shadowOffsetY: 4,
      shadowBlur: 12,

      fontFamily: FONT_FAMILIES.oswald,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 0,

      animationPreset: "pop",
      lightLeakHue: 0,
      lightLeakSeed: 0,
    },
  },

  // ── 6. Neon glow — viral edgy style ──────────────────────────────────────
  {
    id: "neon-glow",
    name: "Neon Glow",
    description: "Cyan glow highlight — dark aesthetic, high energy",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#000000",
      highlightColor: "#00F5FF",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 90,
      verticalPosition: 78,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 0,
      shadowBlur: 30,

      fontFamily: FONT_FAMILIES.rubikDirt,
      fontWeight: "800",
      textTransform: "uppercase",
      letterSpacing: 0,

      animationPreset: "fade",
      lightLeakHue: 180,
      lightLeakSeed: 4,
    },
  },

  // ── 7. Slide storytelling style ──────────────────────────────────────
  {
    id: "storyteller",
    name: "Storyteller",
    description: "Slide entrance, orange highlight — warm & narrative",
    style: {
      textColor: "#FFFFFF",
      strokeColor: "#2a1a00",
      highlightColor: "#FF7A00",
      highlightStrokeColor: "#2a1a00",
      popBackgroundColor: "transparent",

      strokeWidth: 0.5,
      fontSize: 90,
      verticalPosition: 82,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 2,
      shadowOffsetY: 5,
      shadowBlur: 14,

      fontFamily: FONT_FAMILIES.permanentMarker,
      fontWeight: "800",
      textTransform: "none",
      letterSpacing: 0,

      animationPreset: "slide",
      lightLeakHue: 30,
      lightLeakSeed: 5,
    },
  },
];

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  textColor: "#FFFFFF",
  strokeColor: "#000000",
  highlightColor: "#FFFFFF",
  highlightStrokeColor: "#d41ecb",
  popBackgroundColor: "transparent",

  strokeWidth: 0,
  fontSize: 100,
  verticalPosition: 80,
  horizontalPosition: 50,
  maxLines: 1,
  maxWordsPerLine: 2,
  shadowOffsetY: 7,
  shadowBlur: 16,

  fontFamily: FONT_FAMILIES.bangers,
  fontWeight: "600",
  textTransform: "none",
  letterSpacing: 2,

  animationPreset: "pop",

  lightLeakHue: 0,
  lightLeakSeed: 0,
};

// topic
export const TOPIC_DIRECTIVE_MAP_FOR_SCRIPT: Record<
  Topic,
  { openingStyle: string; toneAndCraft: string }
> = {
  MOTIVATIONAL: {
    openingStyle:
      "Open in the darkest moment — mid-struggle, mid-failure. No setup, no context. Drop the viewer into the pain first.",
    toneAndCraft:
      "Build from rock bottom to a turning point that feels earned, not given. The triumph must cost something. End with a single line that makes the viewer feel unstoppable.",
  },
  HORROR_STORY: {
    openingStyle:
      "Open with something subtly wrong — a detail that shouldn't be there, a sound that doesn't fit. No jump scares in the opening. Just wrongness.",
    toneAndCraft:
      "Build dread slowly. Let the horror creep in through small details. Atmosphere over gore, always. End with a reveal or twist that makes the viewer reprocess everything they just heard.",
  },
  HISTORY_FACTS: {
    openingStyle:
      "Open with the most unbelievable sentence from the story — the fact that sounds like fiction. Make it impossible to scroll past.",
    toneAndCraft:
      "Frame history as a thriller. Real names, real stakes, real tension. The viewer should feel like they're watching it happen. End with the consequence that echoes into today.",
  },
  PHILOSOPHY: {
    openingStyle:
      "Open with a single concrete image or scenario that contains the entire idea inside it. No abstract statements. Show, don't define.",
    toneAndCraft:
      "Let the idea unfold through the scenario, not through explanation. Trust the viewer to feel the weight of it. End with a question or a reframe that rewires how they see something ordinary.",
  },
  STORYTELLING: {
    openingStyle:
      "Open mid-scene, mid-emotion. No 'picture this', no 'once upon a time', no meta-narration. The story has already started when the viewer arrives. Drop them inside a moment that already has weight.",
    toneAndCraft:
      "Write like a novelist, not a YouTuber. Specific details over generic ones — not 'she was sad' but 'she kept her eyes on the floor and laughed too quickly.' Let the characters breathe. No moral lessons, no life advice. Just the story, raw and real. End on a line that lingers — not a conclusion, but a feeling.",
  },
  MYSTERY_STORY: {
    openingStyle:
      "Open with an unanswered question buried inside a scene — something is missing, something doesn't add up. Don't announce the mystery. Let the viewer sense it.",
    toneAndCraft:
      "Layer clues naturally into the narrative. Every scene should add tension and deepen the question. The reveal must recontextualise everything that came before it. End with the truth landing like a cold hand on the shoulder.",
  },
  LIFE_HACKS: {
    openingStyle:
      "Open with the problem — vivid, relatable, slightly painful. The viewer should think 'that's literally me' within the first two seconds.",
    toneAndCraft:
      "Frame each insight as a discovery, not a tip. Write like a friend who just figured something out and can't wait to tell you. Save the most powerful insight for the very end.",
  },
  ANY_TOPIC: {
    openingStyle:
      "Choose the opening that creates the most immediate tension, curiosity, or emotion for this specific story. No generic openings.",
    toneAndCraft:
      "Pick the angle, emotion, and style that will make this the most memorable 60 seconds the viewer has today. Surprise us.",
  },
};

export const SYSTEM_BG_MUSIC = [
  "Children",
  "Cinematic",
  "Cinematic 1",
  "Comedy",
  "Comic",
  "Explainer",
  "Futuristic",
  "Horror",
  "Khamzat",
  "Motivational",
  "Romantic",
  "Viral",
] as const;

export const SYSTEM_BG_VIDEO = [
  "minecraft_1",
  "minecraft_2",
  "minecraft_3",
  "minecraft_4",
  "minecraft_5",
  "subway_surfer_1",
  "subway_surfer_2",
  "subway_surfer_3",
  "subway_surfer_4",
  "subway_surfer_5",
] as const;

export const SYSTEM_AI_AVATAR = [
  "andrewtate_1",
  "andrewtate_2",
  "briangriffin_1",
  "briangriffin_2",
  "donaldtrump_1",
  "donaldtrump_2",
  "elonmusk_1",
  "elonmusk_2",
  "joebiden_1",
  "joebiden_2",
  "joerogan_1",
  "joerogan_2",
  "obama_1",
  "obama_2",
  "patrickstar_1",
  "patrickstar_2",
  "petergriffin_1",
  "petergriffin_2",
  "spongebob_1",
  "spongebob_2",
] as const;

// tools page constant
export const TOOLS: Tool[] = [
  // ── Live Tools ──
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
    title: "Brainrot Explainer Video Generator",
    shortTitle: "Brainrot Explainer",
    description:
      "Create viral brainrot content with AI-generated scripts, unhinged voiceovers, and chaotic captions.",
    icon: Flame,
    live: true,
    href: "/tools/brainrot-video-generator",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
  },
  {
    slug: "tiktok-script-generator",
    title: "TikTok Script Generator",
    shortTitle: "TikTok Script",
    description:
      "Generate viral, highly engaging short-form video scripts tailored for TikToks, Shorts, and Reels instantly.",
    icon: FileText,
    live: true,
    href: "/tools/tiktok-script-generator",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-500/10",
  },
  {
    slug: "tiktok-money-calculator",
    title: "TikTok Money Calculator",
    shortTitle: "TikTok Calculator",
    description:
      "Calculate your estimated TikTok earnings based on followers, views, and engagement rate.",
    icon: Calculator,
    live: true,
    href: "/tools/tiktok-money-calculator",
    iconColor: "text-purple-500",
    iconBg: "bg-purple-500/10",
  },
  {
    slug: "tiktok-engagement-rate-calculator",
    title: "TikTok Engagement Rate Calculator",
    shortTitle: "Engagement Calculator",
    description:
      "Calculate your TikTok engagement rate accurately based on views, likes, comments, and shares.",
    icon: TrendingUp,
    live: true,
    href: "/tools/tiktok-engagement-rate-calculator",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
  },

  // ── Coming Soon Tools ──
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
