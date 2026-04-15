"use client";

import { create } from "zustand";
import { DEFAULT_CAPTION_STYLE, DURATIONS, LANGUAGES } from "@/lib/constants";
import type { CaptionStyle } from "@/types";

// ─── Dialogue types ───────────────────────────────────────────────────────────
export interface DialogueLine {
  id: string;
  speaker: 1 | 2;
  text: string;
}

// ─── Full Form State ──────────────────────────────────────────────────────────
export interface ConversationFormState {
  // Language
  languageCode: string;

  // Topic & Duration
  topic: string;
  duration: number;

  // Script / Dialogue
  prompt: string;
  dialogue: DialogueLine[];
  dialogueLanguage: string;

  // Speaker Avatars
  speaker1AvatarId: string | null;
  speaker2AvatarId: string | null;

  // Background Video
  backgroundVideoId: string | null;

  // Speaker Voices
  speaker1VoiceId: string | null;
  speaker2VoiceId: string | null;
  voiceSearchQuery: string;

  // Background Music
  selectedMusicId: string | null;

  // Caption Config
  captionConfig: CaptionStyle;
  captionsEnabled: boolean;
}

export interface ConversationFormStore extends ConversationFormState {
  setField: <K extends keyof ConversationFormState>(
    key: K,
    value: ConversationFormState[K],
  ) => void;
  setCaptionField: <K extends keyof CaptionStyle>(
    key: K,
    value: CaptionStyle[K],
  ) => void;
  setGeneratedDialogue: (lines: Omit<DialogueLine, "id">[], language: string) => void;
  addDialogueLine: (speaker?: 1 | 2) => void;
  updateDialogueLine: (id: string, patch: Partial<Omit<DialogueLine, "id">>) => void;
  removeDialogueLine: (id: string) => void;
  reset: () => void;
}

let _idCounter = 0;
function nextId() {
  return `dl_${++_idCounter}_${Date.now()}`;
}

const INITIAL_STATE: ConversationFormState = {
  languageCode: LANGUAGES[0].code,
  topic: "ANY_TOPIC",
  duration: DURATIONS[2].value,
  prompt: "",
  dialogue: [],
  dialogueLanguage: "",
  speaker1AvatarId: null,
  speaker2AvatarId: null,
  backgroundVideoId: null,
  speaker1VoiceId: null,
  speaker2VoiceId: null,
  voiceSearchQuery: "",
  selectedMusicId: null,
  captionConfig: DEFAULT_CAPTION_STYLE,
  captionsEnabled: true,
};

export const useConversationForm = create<ConversationFormStore>((set) => ({
  ...INITIAL_STATE,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  setCaptionField: (key, value) =>
    set((state) => ({
      ...state,
      captionConfig: { ...state.captionConfig, [key]: value },
    })),

  setGeneratedDialogue: (lines, language) =>
    set((state) => ({
      ...state,
      dialogue: lines.map((l) => ({ ...l, id: nextId() })),
      dialogueLanguage: language,
    })),

  addDialogueLine: (speaker = 1) =>
    set((state) => ({
      ...state,
      dialogue: [
        ...state.dialogue,
        { id: nextId(), speaker, text: "" },
      ],
    })),

  updateDialogueLine: (id, patch) =>
    set((state) => ({
      ...state,
      dialogue: state.dialogue.map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      ),
    })),

  removeDialogueLine: (id) =>
    set((state) => ({
      ...state,
      dialogue: state.dialogue.filter((l) => l.id !== id),
    })),

  reset: () => set({ ...INITIAL_STATE }),
}));
