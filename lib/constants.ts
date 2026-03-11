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
    id: "anime",
    label: "Anime",
    thumbnail: "", // thumnail will come from public folder , in public/images i have all the images for video styles, take the label name from  the image name and add it here with .jpg extension, for example for anime the image name is anime.jpg so the thumbnail will be /images/anime.jpg
  },
  {
    id: "anime",
    label: "Anime",
    thumbnail:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=300&fit=crop",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop",
  },
  {
    id: "comic-art",
    label: "Comic Art",
    thumbnail:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=300&fit=crop",
  },
  {
    id: "isometric",
    label: "Isometric",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=300&fit=crop",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    thumbnail:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&h=300&fit=crop",
  },
  {
    id: "line-drawing",
    label: "Line Drawing",
    thumbnail:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&h=300&fit=crop",
  },
  {
    id: "graffiti",
    label: "Graffiti Art",
    thumbnail:
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=200&h=300&fit=crop",
  },
  {
    id: "pixel-art",
    label: "Pixel Art",
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=300&fit=crop",
  },
  {
    id: "oil-painting",
    label: "Oil Painting",
    thumbnail:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=300&fit=crop",
  },
  {
    id: "neon-art",
    label: "Neon Art",
    thumbnail:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&h=300&fit=crop",
  },
  {
    id: "cubism",
    label: "Cubism",
    thumbnail:
      "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=200&h=300&fit=crop",
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
