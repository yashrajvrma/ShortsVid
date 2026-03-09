import type {
  Language,
  VideoStyle,
  CaptionStyle,
  BackgroundMusic,
} from "../types";

// export const LANGUAGES: Language[] = [
//   { code: "en", name: "English", flag: "🇺🇸" },
//   { code: "es", name: "Spanish", flag: "🇪🇸" },
//   { code: "fr", name: "French", flag: "🇫🇷" },
//   { code: "de", name: "German", flag: "🇩🇪" },
//   { code: "it", name: "Italian", flag: "🇮🇹" },
//   { code: "pt", name: "Portuguese", flag: "🇧🇷" },
//   { code: "ru", name: "Russian", flag: "🇷🇺" },
//   { code: "ja", name: "Japanese", flag: "🇯🇵" },
//   { code: "ko", name: "Korean", flag: "🇰🇷" },
//   { code: "zh", name: "Chinese", flag: "🇨🇳" },
//   { code: "ar", name: "Arabic", flag: "🇸🇦" },
//   { code: "hi", name: "Hindi", flag: "🇮🇳" },
//   { code: "nl", name: "Dutch", flag: "🇳🇱" },
//   { code: "pl", name: "Polish", flag: "🇵🇱" },
//   { code: "tr", name: "Turkish", flag: "🇹🇷" },
//   { code: "sv", name: "Swedish", flag: "🇸🇪" },
//   { code: "no", name: "Norwegian", flag: "🇳🇴" },
//   { code: "da", name: "Danish", flag: "🇩🇰" },
//   { code: "fi", name: "Finnish", flag: "🇫🇮" },
//   { code: "id", name: "Indonesian", flag: "🇮🇩" },
// ];

export const VIDEO_STYLES: VideoStyle[] = [
  {
    id: "natural",
    label: "Natural",
    thumbnail:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "anime",
    label: "Anime",
    thumbnail:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "cinematic",
    label: "Cinematic",
    thumbnail:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "comic-art",
    label: "Comic Art",
    thumbnail:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "isometric",
    label: "Isometric",
    thumbnail:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "watercolor",
    label: "Watercolor",
    thumbnail:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "line-drawing",
    label: "Line Drawing",
    thumbnail:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "graffiti",
    label: "Graffiti Art",
    thumbnail:
      "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "pixel-art",
    label: "Pixel Art",
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "oil-painting",
    label: "Oil Painting",
    thumbnail:
      "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "neon-art",
    label: "Neon Art",
    thumbnail:
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
  {
    id: "cubism",
    label: "Cubism",
    thumbnail:
      "https://images.unsplash.com/photo-1509749837427-ac94a2553d0e?w=200&h=300&fit=crop",
    category: "ai-generated",
  },
];

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: "bold-white",
    label: "Bold White",
    preview: "HELLO WORLD",
    fontClass: "font-black text-white drop-shadow-lg",
  },
  {
    id: "yellow-outline",
    label: "Yellow Outline",
    preview: "Hello World",
    fontClass: "font-bold text-yellow-400",
  },
  {
    id: "subtitle",
    label: "Subtitle",
    preview: "Hello World",
    fontClass: "font-medium text-white bg-black/60 px-2 py-0.5 rounded",
  },
  {
    id: "neon-blue",
    label: "Neon Blue",
    preview: "Hello World",
    fontClass:
      "font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]",
  },
  {
    id: "classic",
    label: "Classic",
    preview: "Hello World",
    fontClass: "font-serif text-white italic",
  },
  {
    id: "pop",
    label: "Pop",
    preview: "Hello World",
    fontClass: "font-black text-pink-400 uppercase tracking-wider",
  },
];

export const BACKGROUND_MUSIC: BackgroundMusic[] = [
  { id: "none", label: "No Music", genre: "None" },
  { id: "lofi-chill", label: "Lo-Fi Chill", genre: "Ambient", duration: "∞" },
  {
    id: "epic-cinematic",
    label: "Epic Cinematic",
    genre: "Orchestral",
    duration: "∞",
  },
  { id: "upbeat-pop", label: "Upbeat Pop", genre: "Pop", duration: "∞" },
  {
    id: "dark-thriller",
    label: "Dark Thriller",
    genre: "Suspense",
    duration: "∞",
  },
  {
    id: "nature-ambient",
    label: "Nature Ambient",
    genre: "Ambient",
    duration: "∞",
  },
  {
    id: "motivational",
    label: "Motivational",
    genre: "Electronic",
    duration: "∞",
  },
  { id: "soft-piano", label: "Soft Piano", genre: "Classical", duration: "∞" },
  { id: "hip-hop", label: "Hip Hop Beat", genre: "Hip Hop", duration: "∞" },
  { id: "meditation", label: "Meditation", genre: "Ambient", duration: "∞" },
];

export const DURATIONS = [
  { value: "30-60", label: "30-60s" },
  { value: "60-90", label: "60-90s" },
  { value: "90-120", label: "90-120s" },
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
