export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export type VideoStyle = {
  id: number | string;
  name?: string;
  label: string;
  thumbnail: string;
};

export interface Duration {
  id: number | string;
  value: number;
  label: string;
}

export interface GenerateScriptRequest {
  languageCode: string;
  topic: string;
  duration: number;
  prompt?: string;
}

export interface GenerateScriptResponse {
  success: boolean;
  script: string;
  scriptId?: string;
}

export interface GenerateVideoRequest {
  languageCode: string;
  topic: string;
  duration: number;
  script: string;
  voiceId: string | null;
  musicId: string | null;
  videoStyle: string;
  captionConfig: {
    fontType: string;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    strokeColor: string;
    strokeWidth: number;
    highlightColor: string;
  };
}
