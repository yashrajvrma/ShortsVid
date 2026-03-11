"use client";

import { useState } from "react";
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

export function useFacelessForm() {
  const [form, setForm] = useState<FacelessFormState>({
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
  });

  // ─── Helpers ────────────────────────────────────────────────────────────────
  const setField = <K extends keyof FacelessFormState>(
    key: K,
    value: FacelessFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setCaptionField = <K extends keyof CaptionConfigState>(
    key: K,
    value: CaptionConfigState[K],
  ) => {
    setForm((prev) => ({
      ...prev,
      captionConfig: { ...prev.captionConfig, [key]: value },
    }));
  };

  const setGeneratedScript = (script: string) => {
    setForm((prev) => ({
      ...prev,
      generatedScript: script,
      generatedScriptLanguage: prev.languageCode,
    }));
  };

  const isScriptLanguageMismatch =
    form.generatedScript !== "" &&
    form.generatedScriptLanguage !== "" &&
    form.generatedScriptLanguage !== form.languageCode;

  return {
    form,
    setField,
    setCaptionField,
    setGeneratedScript,
    isScriptLanguageMismatch,
  };
}
