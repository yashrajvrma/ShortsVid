"use client";

import { useState, useRef } from "react";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks/voice/use-debounce";
import { useVoiceAvatar } from "@/hooks/voice/use-voice-avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Play, Pause, Mic2 } from "lucide-react";
import { Button } from "../ui/button";

// ── Single voice item ─────────────────────────────────────────────────────────
function VoiceItem({
  voice,
  isSelected,
  playingId,
  onSelect,
  onPlay,
}: {
  voice: any;
  isSelected: boolean;
  playingId: string | null;
  onSelect: (id: string) => void;
  onPlay: (id: string, audioUrl: string) => void;
}) {
  const avatarSvg = useVoiceAvatar(voice.name);

  return (
    <button
      type="button"
      onClick={() => onSelect(voice.id)}
      className={`w-full flex items-center gap-2 rounded-lg px-2.5 py-2 transition-all duration-150 text-left ${
        isSelected
          ? "bg-secondary text-secondary-foreground"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="relative size-10 shrink-0 rounded-full overflow-hidden bg-muted">
        <div
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
          className="size-full [&>svg]:size-full"
        />
      </div>

      {/* Info */}
      <div className="flex justify-between items-center min-w-0 w-full">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium truncate">{voice.name}</p>

          {/* Tags */}
          {voice.tags && voice.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {voice.tags.slice(0, 4).map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block text-xs leading-none px-1.5 py-0.5 rounded-sm bg-muted border border-border text-muted-foreground capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* <p
          className={`flex items-center text-sm text-muted-foreground capitalize mb-1 ${isSelected ? "text-secondary-foreground" : ""}`}
        >
          {voice.gender}
        </p> */}
      </div>

      {/* Play button */}
      {voice.audioUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(voice.id, voice.audioUrl!);
          }}
          className="flex size-6 rounded-full  transition-colors shrink-0 mt-0.5"
        >
          {playingId === voice.id ? (
            <Pause
              className={`size-4 text-muted-foreground ${isSelected && "text-primary-foreground"}`}
            />
          ) : (
            <Play
              className={`size-4 text-muted-foreground ${isSelected && "text-primary-foreground"}`}
            />
          )}
        </button>
      )}
    </button>
  );
}

// ── Per-speaker voice panel ───────────────────────────────────────────────────
// Each panel owns its own search state — searching in one never affects the other.
function SpeakerVoicePanel({
  speakerLabel,
  languageCode,
  selectedVoiceId,
  onSelect,
}: {
  speakerLabel: string;
  languageCode: string;
  selectedVoiceId: string | null;
  onSelect: (id: string) => void;
}) {
  const trpc = useTRPC();

  // ── Independent search state per panel ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 400);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data, isLoading } = useQuery(
    trpc.voices.getSystemVoice.queryOptions({
      languageCode,
      query: debouncedQuery || undefined,
    }),
  );

  const voices = data?.voicesWithSignedUrl ?? [];

  const handlePlay = (id: string, audioUrl: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
    setPlayingId(id);
    audio.onended = () => setPlayingId(null);
  };

  const selectedVoiceName =
    voices.find((v) => v.id === selectedVoiceId)?.name ?? null;

  return (
    <Card className="flex-1 p-3 space-y-2.5 min-w-0">
      {/* Header */}
      <div className="flex justify-between gap-2 flex-wrap">
        <div className="text-sm px-2 py-0.5 rounded-md shrink-0">
          {speakerLabel}
        </div>
        {selectedVoiceName && (
          <Badge
            variant="default"
            className="rounded-sm p-1 text-sm text-primary-foreground truncate max-w-[140px]"
          >
            {selectedVoiceName}
          </Badge>
        )}
      </div>

      {/* Search — independent per panel */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search voices…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>

      {/* List */}
      <ScrollArea className="[&>div>div[style]]:!block h-[300px] rounded-md border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-6 text-xs text-muted-foreground">
            Loading voices…
          </div>
        ) : voices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-6 gap-2 text-muted-foreground">
            <Mic2 className="size-5 opacity-30" />
            <p className="text-xs">No voices found</p>
          </div>
        ) : (
          <div className="p-1 space-y-0.5">
            {voices.map((voice) => (
              <VoiceItem
                key={voice.id}
                voice={voice}
                isSelected={selectedVoiceId === voice.id}
                playingId={playingId}
                onSelect={onSelect}
                onPlay={handlePlay}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
interface SpeakerVoiceSelectorProps {
  languageCode: string;
  speaker1VoiceId: string | null;
  speaker2VoiceId: string | null;
  onSelectSpeaker1Voice: (id: string) => void;
  onSelectSpeaker2Voice: (id: string) => void;
}

export function SpeakerVoiceSelector({
  languageCode,
  speaker1VoiceId,
  speaker2VoiceId,
  onSelectSpeaker1Voice,
  onSelectSpeaker2Voice,
}: SpeakerVoiceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Speaker Voices
      </label>

      {/* Responsive: stacks on mobile, side-by-side on sm+ */}
      <div className="flex flex-col sm:flex-row gap-3 mt-3">
        <SpeakerVoicePanel
          speakerLabel="Speaker 1"
          languageCode={languageCode}
          selectedVoiceId={speaker1VoiceId}
          onSelect={onSelectSpeaker1Voice}
        />
        <SpeakerVoicePanel
          speakerLabel="Speaker 2"
          languageCode={languageCode}
          selectedVoiceId={speaker2VoiceId}
          onSelect={onSelectSpeaker2Voice}
        />
      </div>
    </div>
  );
}
