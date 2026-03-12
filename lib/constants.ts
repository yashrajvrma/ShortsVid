import type { Duration, Language, VideoStyle } from "../types";

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

export const VIDEO_STYLES: VideoStyle[] = [
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
