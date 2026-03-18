import { FONT_FAMILIES } from "@/components/remotion/fonts";
import type { CaptionPreset, CaptionStyle, Duration, Language } from "@/types";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

export const VIDEO_STYLES: {
  id: number | string;
  name?: string;
  label: string;
  thumbnail: string;
}[] = [
  {
    id: "ANIME",
    label: "Anime",
    thumbnail: "/images/stocks/anime.jpg",
  },
  {
    id: "CARTOON",
    label: "Cartoon",
    thumbnail: "/images/stocks/cartoon.jpg",
  },
  {
    id: "CINEMATIC",
    label: "Cinematic",
    thumbnail: "/images/stocks/cinematic.jpg",
  },
  {
    id: "COLORFUL_COMICS",
    label: "Colorful Comics",
    thumbnail: "/images/stocks/colorful_comics.jpg",
  },
  {
    id: "CYBERPUNK",
    label: "Cyberpunk",
    thumbnail: "/images/stocks/cyberpunk.jpg",
  },
  {
    id: "PIXEL_ART",
    label: "Pixel Art",
    thumbnail: "/images/stocks/pixel_art.jpg",
  },
  {
    id: "PHOTO_REALISTIC",
    label: "Photo Realistic",
    thumbnail: "/images/stocks/realistic.jpg",
  },
];

export const DURATIONS: Duration[] = [
  { id: 1, value: 15, label: "10-15s" },
  { id: 2, value: 30, label: "15-30s" },
  { id: 3, value: 60, label: "30-60s" },
];

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

// captions

export const CAPTION_PRESETS: CaptionPreset[] = [
  // ── 1. "Since You Guys Are Curious" style ─────────────────────────────────
  // Green highlight on key word, white resting, dark BG, Impact font
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

      strokeWidth: 6,
      fontSize: 96,
      verticalPosition: 75,
      horizontalPosition: 50,
      maxLines: 2,
      maxWordsPerLine: 3,
      shadowOffsetY: 3,
      shadowBlur: 8,

      fontFamily: FONT_FAMILIES.oswald,
      fontWeight: "900",
      textTransform: "uppercase",
      letterSpacing: 1,

      animationPreset: "pop",
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

      strokeWidth: 0.2,
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

      strokeWidth: 1,
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
      textColor: "#F0EFE9",
      strokeColor: "transparent",
      highlightColor: "#F0EFE9",
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

      strokeWidth: 2,
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
      strokeColor: "transparent",
      highlightColor: "#00F5FF",
      highlightStrokeColor: "transparent",
      popBackgroundColor: "transparent",

      strokeWidth: 0,
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
      maxWordsPerLine: 3,
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

  fontFamily: FONT_FAMILIES.bebasNeue,
  fontWeight: "600",
  textTransform: "none",
  letterSpacing: 2,

  animationPreset: "pop",

  lightLeakHue: 0,
  lightLeakSeed: 0,
};
