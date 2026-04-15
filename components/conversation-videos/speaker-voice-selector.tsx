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
          ? "bg-secondary text-secondary-foreground border border-primary/30"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      {/* Avatar */}
      <div className="relative size-8 shrink-0 rounded-full overflow-hidden border border-border bg-muted">
        <div
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
          className="size-full [&>svg]:size-full"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{voice.name}</p>
        <p className="text-[10px] text-muted-foreground capitalize">
          {voice.gender}
        </p>
      </div>

      {/* Play button */}
      {voice.audioUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(voice.id, voice.audioUrl!);
          }}
          className="size-6 rounded-full flex items-center justify-center bg-muted transition-colors shrink-0 hover:bg-muted/80"
        >
          {playingId === voice.id ? (
            <Pause className="size-3 text-primary" />
          ) : (
            <Play className="size-3 text-muted-foreground" />
          )}
        </button>
      )}
    </button>
  );
}

// ── Per-speaker voice panel ───────────────────────────────────────────────────
function SpeakerVoicePanel({
  speakerLabel,
  speakerNum,
  languageCode,
  searchQuery,
  selectedVoiceId,
  onSearchChange,
  onSelect,
}: {
  speakerLabel: string;
  speakerNum: 1 | 2;
  languageCode: string;
  searchQuery: string;
  selectedVoiceId: string | null;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
}) {
  const trpc = useTRPC();
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
      <div className="flex items-center gap-2">
        <Badge
          variant={speakerNum === 1 ? "default" : "secondary"}
          className="text-xs px-2 py-0.5 rounded-md shrink-0"
        >
          {speakerLabel}
        </Badge>
        {selectedVoiceName && (
          <span className="text-[11px] text-muted-foreground truncate">
            {selectedVoiceName}
          </span>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 h-8 text-xs"
        />
      </div>

      {/* List */}
      <ScrollArea className="[&>div>div[style]]:!block h-[180px] rounded-md border border-border">
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
  voiceSearchQuery: string;
  onVoiceSearchChange: (v: string) => void;
  onSelectSpeaker1Voice: (id: string) => void;
  onSelectSpeaker2Voice: (id: string) => void;
}

export function SpeakerVoiceSelector({
  languageCode,
  speaker1VoiceId,
  speaker2VoiceId,
  voiceSearchQuery,
  onVoiceSearchChange,
  onSelectSpeaker1Voice,
  onSelectSpeaker2Voice,
}: SpeakerVoiceSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">
        Speaker Voices
      </label>

      <div className="flex gap-3">
        <SpeakerVoicePanel
          speakerLabel="Speaker 1"
          speakerNum={1}
          languageCode={languageCode}
          searchQuery={voiceSearchQuery}
          selectedVoiceId={speaker1VoiceId}
          onSearchChange={onVoiceSearchChange}
          onSelect={onSelectSpeaker1Voice}
        />
        <SpeakerVoicePanel
          speakerLabel="Speaker 2"
          speakerNum={2}
          languageCode={languageCode}
          searchQuery={voiceSearchQuery}
          selectedVoiceId={speaker2VoiceId}
          onSearchChange={onVoiceSearchChange}
          onSelect={onSelectSpeaker2Voice}
        />
      </div>
    </div>
  );
}
