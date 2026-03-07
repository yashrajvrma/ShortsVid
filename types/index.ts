export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export type VideoStyle = {
  id: string;
  label: string;
  thumbnail: string;
  category: "ai-generated" | "stock";
};

export type CaptionStyle = {
  id: string;
  label: string;
  preview: string;
  fontClass: string;
};

export type BackgroundMusic = {
  id: string;
  label: string;
  genre: string;
  previewUrl?: string;
  duration?: string;
};

export type ScriptVersion = {
  version: number;
  content: string;
  generatedAt: string;
};

export type ProjectFormState = {
  title: string;
  language: string;
  prompt: string;
  script: string;
  scriptMode: "generate" | "manual";
  selectedStyle: string;
  captionStyleId: string;
  captionsEnabled: boolean;
  backgroundMusicId: string;
  duration: "30-60" | "60-90" | "90-120";
  scriptVersions: ScriptVersion[];
  currentVersion: number;
  projectId: string | null;
};

export type GenerateScriptRequest = {
  projectId?: string | null;
  title: string;
  language: string;
  prompt: string;
  duration: string;
};

export type GenerateScriptResponse = {
  projectId: string;
  script: string;
  version: number;
};

export type GenerateVideoRequest = {
  projectId: string;
  script: string;
  styleId: string;
  captionsEnabled: boolean;
  captionStyleId: string;
  backgroundMusicId: string;
  duration: string;
};
