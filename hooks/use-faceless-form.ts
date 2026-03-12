"use client";

import { create } from "zustand";
import { DURATIONS, LANGUAGES } from "@/lib/constants";

// ─── Caption Config ────────────────────────────────────────────────────────────
export interface CaptionConfigState {
  fontType: string;
  fontSize: number;
  textColor: string;
  backgroundColor: string;
  strokeColor: string;
  strokeWidth: number;
  highlightColor: string;
}

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
  generatedScriptLanguage: string; // track the language used when script was generated

  // Voice
  selectedVoiceId: string | null;
  voiceSearchQuery: string;

  // Background Music
  selectedMusicId: string | null;

  // Video Style
  videoStyle: string;

  // Caption Config
  captionConfig: CaptionConfigState;
}

const DEFAULT_CAPTION: CaptionConfigState = {
  fontType: "bold",
  fontSize: 48,
  textColor: "#FFFFFF",
  backgroundColor: "#000000",
  strokeColor: "#000000",
  strokeWidth: 2,
  highlightColor: "#FF00FF",
};

export interface FacelessFormStore extends FacelessFormState {
  setField: <K extends keyof FacelessFormState>(
    key: K,
    value: FacelessFormState[K],
  ) => void;
  setCaptionField: <K extends keyof CaptionConfigState>(
    key: K,
    value: CaptionConfigState[K],
  ) => void;
  setGeneratedScript: (script: string) => void;
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
  videoStyle: "CINEMATIC",
  captionConfig: DEFAULT_CAPTION,

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
}));

export const getIsScriptLanguageMismatch = (state: FacelessFormStore) =>
  state.generatedScript !== "" &&
  state.generatedScriptLanguage !== "" &&
  state.generatedScriptLanguage !== state.languageCode;
