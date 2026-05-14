// usefacelessform.ts - Zustand store for managing the state of the faceless video creation form
"use client";

import { create } from "zustand";
import { DEFAULT_CAPTION_STYLE, DURATIONS, LANGUAGES } from "@/lib/constants";
import { CaptionStyle } from "@/types";

// ─── Full Form State ──────────────────────────────────────────────────────────
export interface FacelessFormState {
  // Language
  languageCode: string;

  // Topic & Duration
  topic: string;
  duration: number;

  // Script
  scriptMode: "generate" | "manual";
  prompt: string;
  generatedScript: string;
  generatedScriptLanguage: string;

  // Voice
  selectedVoiceId: string | null;
  voiceSearchQuery: string;

  // Background Music
  selectedMusicId: string | null;

  // Video Style
  videoStyle: string;

  // Caption Config — now uses the full CaptionStyle type
  captionConfig: CaptionStyle;
  captionsEnabled: boolean;
}

export interface FacelessFormStore extends FacelessFormState {
  setField: <K extends keyof FacelessFormState>(
    key: K,
    value: FacelessFormState[K],
  ) => void;
  setCaptionField: <K extends keyof CaptionStyle>(
    key: K,
    value: CaptionStyle[K],
  ) => void;
  setGeneratedScript: (script: string) => void;
  reset: () => void;
}

export const useFacelessForm = create<FacelessFormStore>((set) => ({
  languageCode: LANGUAGES[0].code,
  topic: "ANY_TOPIC",
  duration: DURATIONS[2].value,
  scriptMode: "generate",
  prompt: "",
  generatedScript: "",
  generatedScriptLanguage: "",
  selectedVoiceId: null,
  voiceSearchQuery: "",
  selectedMusicId: null,
  videoStyle: "COMIC",
  captionConfig: DEFAULT_CAPTION_STYLE,
  captionsEnabled: true,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  setCaptionField: (key, value) =>
    set((state) => ({
      ...state,
      captionConfig: { ...state.captionConfig, [key]: value },
    })),

  setGeneratedScript: (script) =>
    set((state) => ({
      ...state,
      generatedScript: script,
      generatedScriptLanguage: state.languageCode,
    })),

  reset: () =>
    set({
      languageCode: LANGUAGES[0].code,
      topic: "ANY_TOPIC",
      duration: DURATIONS[2].value,
      scriptMode: "generate",
      prompt: "",
      generatedScript: "",
      generatedScriptLanguage: "",
      selectedVoiceId: null,
      voiceSearchQuery: "",
      selectedMusicId: null,
      videoStyle: "",
      captionConfig: DEFAULT_CAPTION_STYLE,
      captionsEnabled: true,
    }),
}));

export const getIsScriptLanguageMismatch = (state: FacelessFormStore) =>
  state.generatedScript !== "" &&
  state.generatedScriptLanguage !== "" &&
  state.generatedScriptLanguage !== state.languageCode;

// Re-export CaptionStyle for backward compat
// export type { CaptionStyle };
